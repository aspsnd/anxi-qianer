import { AnxiEvent } from './event';

export type AnxiPlainHandler<EN> = (e: AnxiEvent<EN>) => boolean | void;
export type AsyncAnxiHandler<EN> = (e: AnxiEvent<EN>) => Promise<boolean | void>;
export type AnxiListener<EN> = {
    index: number
    always: boolean
    valid: boolean
    context?: any
    async: boolean
    name: EN
}
export interface AnxiPlainListener<EN> extends AnxiListener<EN> {
    handler: AnxiPlainHandler<EN>
}
export interface AsyncAnxiListener<EN> extends AnxiListener<EN> {
    handler: AsyncAnxiHandler<EN>
}