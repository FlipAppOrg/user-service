// card.interface.ts
export interface Card {
    id: number;
    cardNumber: string;
    expiry: string;
    cvv: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  }
  