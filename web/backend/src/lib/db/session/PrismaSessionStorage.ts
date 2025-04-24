import { type PrismaClient } from '@prisma/client';
import { type OnlineAccessInfo, Session } from '@shopify/shopify-api';
import { type SessionStorage } from '@shopify/shopify-app-session-storage';

export class PrismaSessionStorage implements SessionStorage {
  constructor(private prisma: PrismaClient) {}

  async storeSession(session: Session): Promise<boolean> {
    const onlineAccessInfo = session?.onlineAccessInfo?.associated_user.id;

    await this.prisma.shopifySession.upsert({
      create: {
        id: session.id,
        state: session.state,
        isOnline: session.isOnline,
        shop: session.shop,
        accessToken: session.accessToken,
        expires: session.expires,
        scope: session.scope,
        onlineAccessInfo,
      },
      update: {
        state: session.state,
        isOnline: session.isOnline,
        shop: session.shop,
        accessToken: session.accessToken,
        expires: session.expires,
        scope: session.scope,
        onlineAccessInfo,
      },
      where: { id: session.id },
    });

    return true;
  }
  async loadSession(id: string): Promise<Session | undefined> {
    const session = await this.prisma.shopifySession.findUnique({
      where: { id },
    });

    if (session) {
      return new Session({
        id: session.id,
        isOnline: session.isOnline,
        shop: session.shop,
        state: session.state,
        scope: session.scope ?? undefined,
        expires: session.expires ?? undefined,
        accessToken: session.accessToken ?? undefined,
        ...(session.onlineAccessInfo && {
          onlineAccessInfo: {
            associated_user: { id: session.onlineAccessInfo },
          } as OnlineAccessInfo,
        }),
      });
    }
    return undefined;
  }
  async deleteSession(id: string): Promise<boolean> {
    await this.prisma.shopifySession.delete({ where: { id } });
    return true;
  }
  async deleteSessions(ids: string[]): Promise<boolean> {
    const result = await this.prisma.shopifySession.deleteMany({
      where: { id: { in: ids } },
    });
    return !!result.count;
  }
  async findSessionsByShop(shop: string): Promise<Session[]> {
    const sessions = await this.prisma.shopifySession.findMany({
      where: { shop },
    });

    return sessions.map(
      (session) =>
        new Session({
          id: session.id,
          isOnline: session.isOnline,
          shop: session.shop,
          state: session.state,
          scope: session.scope ?? undefined,
          expires: session.expires ?? undefined,
          accessToken: session.accessToken ?? undefined,
          ...(session.onlineAccessInfo && {
            onlineAccessInfo: {
              associated_user: { id: session.onlineAccessInfo },
            } as OnlineAccessInfo,
          }),
        })
    );
  }
}
