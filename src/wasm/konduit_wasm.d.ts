/* tslint:disable */
/* eslint-disable */

/**
 * A Konduit Adaptor.
 */
export class Adaptor {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static new(url: string): Promise<Adaptor>;
}

/**
 * Channel parameters and ToS of a given adaptor.
 */
export class AdaptorInfo {
    free(): void;
    [Symbol.dispose](): void;
    constructor(adaptor_key: VerificationKey, close_period: bigint, max_tag_length: number, fee: bigint);
    readonly closePeriod: bigint;
    readonly fee: bigint;
    readonly maxTagLength: number;
    readonly verificationKey: VerificationKey;
}

/**
 * A channel output as visible on the Cardano L1
 */
export class ChannelOutput {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Indicate whether the channel is 'Closed'
     */
    readonly isClosed: boolean;
    /**
     * Indicate whether the channel is 'Opened'
     */
    readonly isOpened: boolean;
    /**
     * Indicate whether the channel is 'Responded'
     */
    readonly isResponded: boolean;
    /**
     * Return the total amount already subbed from the channel
     */
    readonly subbedAmount: bigint;
    /**
     * Return the channel tag.
     */
    readonly tag: Tag;
    /**
     * Return the total amount deposited in the channel. Owed amount is obtained by looking at the
     * receipt.
     */
    readonly totalAmount: bigint;
}

/**
 * A reference to a Cardano connector.
 */
export class Connector {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static new(url: string): Promise<Connector>;
}

/**
 * A list of known locks the consumer expect to see while syncing with the adaptor.
 */
export class ConsumerState {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    static deserialize(value: string): ConsumerState;
    /**
     * Record the payment, while preventing the  consumer from re-using locks or indexes.
     *
     * Note that we could make an argument for re-using indexes (but never locks), as a mechanism
     * for the end user to retry payments from the same invoice, but this has significant
     * implications which are tricky to deal with. We will thereby revisit this decision later
     * once the rest of the implementation has stabilized.
     *
     * This returns a `VerifiedQuote`, which carries the proof that this check was performed.
     * `pay` will only accept `VerifiedQuote`.
     */
    record(invoice: Invoice, quote: Quote): PaymentRequest;
    serialize(): string;
    /**
     * Update the consumer internal state by acknowledging the latest synced status.
     */
    sync(sync_status: SyncStatus): void;
}

/**
 * A wrapper around the blake2b-224 hash digest of a key or script.
 */
export class Credential {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    asKey(): Hash28 | undefined;
    asScript(): Hash28 | undefined;
    equals(other: Credential): boolean;
    toStringWithNetworkId(network_id: NetworkId): string;
    static tryParse(credential: string): Credential;
}

/**
 * @hidden
 */
declare class Error2 {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly message: string;
}
export { Error2 as Error }

/**
 * A blake-2b hash digest of 28 bytes (224 bits)
 */
export class Hash28 {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    toString(): string;
}

/**
 * A blake-2b hash digest of 32 bytes (256 bits)
 */
export class Hash32 {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    toString(): string;
}

/**
 * A reference to a past transaction output.
 */
export class Input {
    free(): void;
    [Symbol.dispose](): void;
    constructor(transaction_id: Hash32, output_index: bigint);
    readonly outputIndex: bigint;
    readonly transactionId: Hash32;
}

/**
 * An `Input` alongside its resolved `Output`
 */
export class InputSummary {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly input: Input;
    readonly output: OutputSummary;
}

/**
 * A parsed Bolt11 invoice
 */
export class Invoice {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    toString(): string;
    static tryParse(value: string): Invoice;
    readonly lock: Lock;
}

/**
 * A 'black-box' API for Konduit L1 & L2 operations.
 */
export class Konduit {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Add funds to an existing channel.
     */
    addToChannel(amount: bigint): Promise<Hash32>;
    /**
     * Find channels that belongs to "us"
     */
    channels(): Promise<ChannelOutput[]>;
    /**
     * Close the currently active channel, if any.
     */
    closeChannel(): Promise<Hash32>;
    /**
     * Get a quote for a given Bolt11 invoice from the adapator.
     */
    getQuoteFor(invoice: Invoice): Promise<Quote>;
    /**
     * Restore an instance from a signing key. Everything else (connector, adaptor, ...) is
     * initially NOT configured.
     *
     * Note that this take ownership of the signing key /!\, to prevent it from leaking elsewhere
     * afterwards.
     */
    constructor(network_id: NetworkId, script_deployment_address: ShelleyAddress, signing_key: SigningKey);
    /**
     * Open a channel with the given tag and initial deposit.
     */
    openChannel(tag: Tag, amount: bigint): Promise<Hash32>;
    /**
     * Pay an invoice using a previously established quote.
     */
    pay(request: PaymentRequest, state: ConsumerState): Promise<SyncStatus>;
    /**
     * Remove any existing channel tag
     */
    resetChannelTag(): void;
    /**
     * Recover a previously known tag, if any.
     */
    setChannelTag(tag: Tag): void;
    /**
     * Synchronize the channel with the adaptor.
     */
    syncChannel(state: ConsumerState): Promise<SyncStatus>;
    /**
     * Configure an (unauthenticated) adaptor, without a defined tag yet. Suitable to get the
     * adaptor info and other non-authenticated operations.
     */
    readonly adaptorInfo: AdaptorInfo;
    /**
     * Get a reference to the connector.
     */
    connector: Connector;
    /**
     * Current network id for which the app is configured.
     */
    readonly networkId: NetworkId;
    /**
     * Configure an (unauthenticated) adaptor, without a defined tag yet. Suitable to get the
     * adaptor info and other non-authenticated operations.
     */
    set adaptor(value: Adaptor);
    /**
     * A handle on the underlying wallet.
     */
    readonly wallet: Wallet;
}

/**
 * The hash of an HTLC secret, awaiting a preimage.
 */
export class Lock {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    equals(other: Lock): boolean;
    toString(): string;
    static tryParse(value: string): Lock;
}

/**
 * A log level to configure the logger.
 */
export enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
}

/**
 * A network identifier to protect misuses of addresses or transactions on a wrong network.
 */
export class NetworkId {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static mainnet(): NetworkId;
    static testnet(): NetworkId;
    toString(): string;
}

/**
 * A transaction output, which comprises of at least an Address and a Value.
 */
export class Output {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
}

/**
 * An `Output` that carries only reference scripts as hashes, and not plain scripts.
 */
export class OutputSummary {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly address: ShelleyAddress;
    readonly lovelace: bigint;
    readonly script: Hash28 | undefined;
}

/**
 * A wrapper around a quote and an invoice ensuring that some checks have happened.
 */
export class PaymentRequest {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
}

/**
 * Proposed price and routing fee by an Adaptor for a given Bolt11 invoice.
 */
export class Quote {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly amount: bigint;
    readonly index: bigint;
    readonly relativeTimeout: bigint;
    readonly routingFee: bigint;
}

/**
 * An `Address`, specialized to the `Shelley` kind.
 */
export class ShelleyAddress {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    equals(other: ShelleyAddress): boolean;
    toString(): string;
    static tryParse(addr: string): ShelleyAddress;
    readonly delegationCredential: Credential | undefined;
    readonly paymentCredential: Credential;
}

/**
 * An Ed25519 signing key (non-extended).
 */
export class SigningKey {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    toString(): string;
    static tryParse(value: string): SigningKey;
}

/**
 * A summary of a syncChannel operation.
 */
export class SyncStatus {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    owed: bigint;
    readonly locked: BigUint64Array;
    readonly squashed: BigUint64Array;
}

/**
 * An up-to-32-bytes tag to allow reuse of `VerificationKey` across channels.
 */
export class Tag {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static generate(length: number): Tag;
    toString(): string;
    static tryParse(value: string): Tag;
}

/**
 * A synthetic representation of a transaction used by the Connector.
 */
export class TransactionSummary {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static deserialise(s: string): TransactionSummary;
    serialise(): string;
    readonly depth: bigint;
    readonly id: Hash32;
    readonly index: bigint;
    readonly inputs: InputSummary[];
    readonly outputs: OutputSummary[];
    readonly timestamp: Date;
}

/**
 * An Ed25519 verification key (non-extended).
 */
export class VerificationKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Encode the `VerificationKey` as a 64-digit hex-encoded text string.
     */
    toString(): string;
    /**
     * Construct a `VerificationKey` from a 64-digit hex-encoded text string. Throws if the
     * string is malformed.
     */
    static tryParse(value: string): VerificationKey;
}

/**
 * A rudimentary wallet interface
 */
export class Wallet {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Retrieve the balance of the underlying L1 wallet.
     */
    balance(connector: Connector): Promise<bigint>;
    resetExitAddress(): void;
    resetStakeCredential(): void;
    /**
     * Retrieve the transaction activity around the underlying L1 wallet. This includes channels
     * opening and closing, but not intermediate operation on channels that do not involve the
     * wallet.
     */
    transactions(connector: Connector): Promise<TransactionSummary[]>;
    readonly address: ShelleyAddress;
    get exitAddress(): ShelleyAddress | undefined;
    set exitAddress(value: ShelleyAddress);
    readonly paymentCredential: Credential;
    get stakeCredential(): Credential | undefined;
    set stakeCredential(value: Credential);
    readonly verificationKey: VerificationKey;
}

/**
 * To be called once in the application life-cycle to make logs from Rust/Wasm displayed in the
 * browser console, and to install a hook on Rust internal panics in order to make them bubble as
 * plain JavaScript errors.
 */
export function enableLogsAndPanicHook(level: LogLevel): void;
