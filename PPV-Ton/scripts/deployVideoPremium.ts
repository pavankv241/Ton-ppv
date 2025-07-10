import { toNano } from '@ton/core';
import { VideoPremium } from '../build/VideoPremium/VideoPremium_VideoPremium';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const videoPremium = provider.open(await VideoPremium.fromInit(BigInt(Math.floor(Math.random() * 10000)), 0n));

    await videoPremium.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(videoPremium.address);

    console.log('ID', await videoPremium.getId());
}
