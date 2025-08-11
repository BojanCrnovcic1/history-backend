import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { Subscriptions } from 'src/entities/subscriptions.entity';
import { CreateSubscriptionDto } from './dto/create.subscription.dto';
import { UpdateSubscriptionDto } from './dto/update.subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscriptions)
    private readonly subsRepo: Repository<Subscriptions>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async create(dto: CreateSubscriptionDto) {
    const user = await this.usersRepo.findOne({ where: { userId: dto.userId }, relations: ['subscriptions'] });
    if (!user) throw new NotFoundException('User not found');

    const now = new Date();

    const active = await this.subsRepo.findOne({
      where: { userId: dto.userId, paymentStatus: 'paid', endDate: MoreThan(now) },
      order: { endDate: 'DESC' },
    });

    const startDate = active ? new Date(active.endDate) : new Date();
    const endDate = new Date(startDate.getTime());

    if (dto.type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = this.subsRepo.create({
      userId: dto.userId,
      type: dto.type,
      startDate,
      endDate,
      paymentStatus: 'pending',
    });

    const saved = await this.subsRepo.save(subscription);
    this.logger.log(`Created subscription ${saved.subscriptionId} for user ${dto.userId}`);
    return saved;
  }

  async findAll() {
    return this.subsRepo.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const sub = await this.subsRepo.findOne({ where: { subscriptionId: id }, relations: ['user'] });
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async findByUser(userId: number) {
    return this.subsRepo.find({ where: { userId }, order: { startDate: 'DESC' } });
  }

  async update(id: number, dto: UpdateSubscriptionDto) {
    const sub = await this.findOne(id);
    Object.assign(sub, dto);
    return this.subsRepo.save(sub);
  }

  async remove(id: number) {
    const sub = await this.findOne(id);
    return this.subsRepo.remove(sub);
  }

  async markAsPaid(subscriptionId: number, paypalOrderId?: string) {
    const sub = await this.findOne(subscriptionId);
    sub.paymentStatus = 'paid';
    if (paypalOrderId) sub.paypalOrderId = paypalOrderId; // Možeš preimenovati u paypalOrderId ako želiš

    const saved = await this.subsRepo.save(sub);

    const user = await this.usersRepo.findOne({ where: { userId: sub.userId } });
    if (!user) throw new NotFoundException('User for subscription not found');

    user.isPremium = true;
    user.subscriptionType = sub.type;
    user.subscriptionExpiresAt = sub.endDate;

    await this.usersRepo.save(user);

    this.logger.log(`Subscription ${subscriptionId} marked as paid and user ${user.userId} upgraded to premium until ${user.subscriptionExpiresAt}`);
    return saved;
  }

  async refreshUsersPremiumStatus() {
    const users = await this.usersRepo.find({ relations: ['subscriptions'] });
    const now = new Date();

    for (const user of users) {
      const paidSubs = (user.subscriptions || []).filter(s => s.paymentStatus === 'paid');
      const active = paidSubs.filter(s => new Date(s.endDate) > now);

      if (active.length > 0) {
        const maxEnd = active.reduce((prev, cur) => (new Date(prev.endDate) > new Date(cur.endDate) ? prev : cur));
        user.isPremium = true;
        user.subscriptionType = maxEnd.type;
        user.subscriptionExpiresAt = maxEnd.endDate;
      } else {
        user.isPremium = false;
        user.subscriptionType = null;
        user.subscriptionExpiresAt = null;
      }

      await this.usersRepo.save(user);
    }
  }
}
