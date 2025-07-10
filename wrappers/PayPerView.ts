import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

// Video information structure
export interface VideoInfo {
    owner: Address;
    videoPrice: bigint;
    videoHash: string;
    videoTitle: string;
    videoDescription: string;
    totalViews: bigint;
    totalRevenue: bigint;
    isActive: boolean;
}

// Contract state interface
export interface PayPerViewConfig {
    owner: Address;
    videoPrice: bigint;
    videoHash: string;
    videoTitle: string;
    videoDescription: string;
}

// PayPerView contract wrapper
export class PayPerView implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    // Create contract instance
    static createFromAddress(address: Address) {
        return new PayPerView(address);
    }

    // Create contract instance with config
    static createFromConfig(config: PayPerViewConfig, code?: Cell) {
        const data = beginCell()
            .storeAddress(config.owner)
            .storeUint(config.videoPrice, 64)
            .storeStringTail(config.videoHash)
            .storeStringTail(config.videoTitle)
            .storeStringTail(config.videoDescription)
            .endCell();
        
        const init = { code: code ?? Cell.EMPTY, data };
        const address = contractAddress(0, init);
        return new PayPerView(address, init);
    }

    // Send purchase message
    async sendPurchase(
        provider: ContractProvider,
        via: Sender,
        value: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x7362d09c, 32) // purchase op
                .endCell(),
        });
    }

    // Send withdraw message (owner only)
    async sendWithdraw(
        provider: ContractProvider,
        via: Sender,
        value: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x595f07bc, 32) // withdraw op
                .endCell(),
        });
    }

    // Send update video message (owner only)
    async sendUpdateVideo(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        title: string,
        description: string,
        price: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x1a0b9d51, 32) // update_video op
                .storeStringTail(title)
                .storeStringTail(description)
                .storeUint(price, 64)
                .endCell(),
        });
    }

    // Send toggle active message (owner only)
    async sendToggleActive(
        provider: ContractProvider,
        via: Sender,
        value: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x2fcb26a2, 32) // toggle_active op
                .endCell(),
        });
    }

    // Get video information
    async getVideoInfo(provider: ContractProvider): Promise<VideoInfo> {
        const result = await provider.get('getVideoInfo', []);
        return {
            owner: result.stack.readAddress(),
            videoPrice: result.stack.readBigNumber(),
            videoHash: result.stack.readString(),
            videoTitle: result.stack.readString(),
            videoDescription: result.stack.readString(),
            totalViews: result.stack.readBigNumber(),
            totalRevenue: result.stack.readBigNumber(),
            isActive: result.stack.readBoolean(),
        };
    }

    // Check if address has purchased
    async hasPurchased(provider: ContractProvider, address: Address): Promise<boolean> {
        const result = await provider.get('hasPurchased', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        return result.stack.readBoolean();
    }

    // Get total viewers count
    async getTotalViewers(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('getTotalViewers', []);
        return result.stack.readBigNumber();
    }
} 