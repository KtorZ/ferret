/**
 * A Konduit Adaptor.
 */
export class Adaptor {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Adaptor.prototype);
        obj.__wbg_ptr = ptr;
        AdaptorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AdaptorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_adaptor_free(ptr, 0);
    }
    /**
     * @param {string} url
     * @returns {Promise<Adaptor>}
     */
    static new(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.adaptor_new(ptr0, len0);
        return ret;
    }
}
if (Symbol.dispose) Adaptor.prototype[Symbol.dispose] = Adaptor.prototype.free;

/**
 * Channel parameters and ToS of a given adaptor.
 */
export class AdaptorInfo {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AdaptorInfo.prototype);
        obj.__wbg_ptr = ptr;
        AdaptorInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AdaptorInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_adaptorinfo_free(ptr, 0);
    }
    /**
     * @param {VerificationKey} adaptor_key
     * @param {bigint} close_period
     * @param {number} max_tag_length
     * @param {bigint} fee
     */
    constructor(adaptor_key, close_period, max_tag_length, fee) {
        _assertClass(adaptor_key, VerificationKey);
        var ptr0 = adaptor_key.__destroy_into_raw();
        const ret = wasm.adaptorinfo__wasm_new(ptr0, close_period, max_tag_length, fee);
        this.__wbg_ptr = ret >>> 0;
        AdaptorInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get closePeriod() {
        const ret = wasm.adaptorinfo_closePeriod(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {bigint}
     */
    get fee() {
        const ret = wasm.adaptorinfo_fee(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {number}
     */
    get maxTagLength() {
        const ret = wasm.adaptorinfo_maxTagLength(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {VerificationKey}
     */
    get verificationKey() {
        const ret = wasm.adaptorinfo_verificationKey(this.__wbg_ptr);
        return VerificationKey.__wrap(ret);
    }
}
if (Symbol.dispose) AdaptorInfo.prototype[Symbol.dispose] = AdaptorInfo.prototype.free;

/**
 * A channel output as visible on the Cardano L1
 */
export class ChannelOutput {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChannelOutput.prototype);
        obj.__wbg_ptr = ptr;
        ChannelOutputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChannelOutputFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channeloutput_free(ptr, 0);
    }
    /**
     * Indicate whether the channel is 'Closed'
     * @returns {boolean}
     */
    get isClosed() {
        const ret = wasm.channeloutput_isClosed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Indicate whether the channel is 'Opened'
     * @returns {boolean}
     */
    get isOpened() {
        const ret = wasm.channeloutput_isOpened(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Indicate whether the channel is 'Responded'
     * @returns {boolean}
     */
    get isResponded() {
        const ret = wasm.channeloutput_isResponded(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the total amount already subbed from the channel
     * @returns {bigint}
     */
    get subbedAmount() {
        const ret = wasm.channeloutput_subbedAmount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Return the channel tag.
     * @returns {Tag}
     */
    get tag() {
        const ret = wasm.channeloutput_tag(this.__wbg_ptr);
        return Tag.__wrap(ret);
    }
    /**
     * Return the total amount deposited in the channel. Owed amount is obtained by looking at the
     * receipt.
     * @returns {bigint}
     */
    get totalAmount() {
        const ret = wasm.channeloutput_totalAmount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
if (Symbol.dispose) ChannelOutput.prototype[Symbol.dispose] = ChannelOutput.prototype.free;

/**
 * A reference to a Cardano connector.
 */
export class Connector {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Connector.prototype);
        obj.__wbg_ptr = ptr;
        ConnectorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConnectorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_connector_free(ptr, 0);
    }
    /**
     * @param {string} url
     * @returns {Promise<Connector>}
     */
    static new(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.connector_new(ptr0, len0);
        return ret;
    }
}
if (Symbol.dispose) Connector.prototype[Symbol.dispose] = Connector.prototype.free;

/**
 * A list of known locks the consumer expect to see while syncing with the adaptor.
 */
export class ConsumerState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ConsumerState.prototype);
        obj.__wbg_ptr = ptr;
        ConsumerStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConsumerStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_consumerstate_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.consumerstate__wasm_new();
        this.__wbg_ptr = ret >>> 0;
        ConsumerStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} value
     * @returns {ConsumerState}
     */
    static deserialize(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.consumerstate_deserialize(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ConsumerState.__wrap(ret[0]);
    }
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
     * @param {Invoice} invoice
     * @param {Quote} quote
     * @returns {PaymentRequest}
     */
    record(invoice, quote) {
        _assertClass(invoice, Invoice);
        _assertClass(quote, Quote);
        const ret = wasm.consumerstate_record(this.__wbg_ptr, invoice.__wbg_ptr, quote.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PaymentRequest.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    serialize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.consumerstate_serialize(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Update the consumer internal state by acknowledging the latest synced status.
     * @param {SyncStatus} sync_status
     */
    sync(sync_status) {
        _assertClass(sync_status, SyncStatus);
        wasm.consumerstate_sync(this.__wbg_ptr, sync_status.__wbg_ptr);
    }
}
if (Symbol.dispose) ConsumerState.prototype[Symbol.dispose] = ConsumerState.prototype.free;

/**
 * A wrapper around the blake2b-224 hash digest of a key or script.
 */
export class Credential {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Credential.prototype);
        obj.__wbg_ptr = ptr;
        CredentialFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CredentialFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_credential_free(ptr, 0);
    }
    /**
     * @returns {Hash28 | undefined}
     */
    asKey() {
        const ret = wasm.credential_asKey(this.__wbg_ptr);
        return ret === 0 ? undefined : Hash28.__wrap(ret);
    }
    /**
     * @returns {Hash28 | undefined}
     */
    asScript() {
        const ret = wasm.credential_asScript(this.__wbg_ptr);
        return ret === 0 ? undefined : Hash28.__wrap(ret);
    }
    /**
     * @param {Credential} other
     * @returns {boolean}
     */
    equals(other) {
        _assertClass(other, Credential);
        const ret = wasm.credential_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {NetworkId} network_id
     * @returns {string}
     */
    toStringWithNetworkId(network_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            _assertClass(network_id, NetworkId);
            var ptr0 = network_id.__destroy_into_raw();
            const ret = wasm.credential_toStringWithNetworkId(this.__wbg_ptr, ptr0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} credential
     * @returns {Credential}
     */
    static tryParse(credential) {
        const ptr0 = passStringToWasm0(credential, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.credential_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Credential.__wrap(ret[0]);
    }
}
if (Symbol.dispose) Credential.prototype[Symbol.dispose] = Credential.prototype.free;

/**
 * @hidden
 */
class Error2 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Error2.prototype);
        obj.__wbg_ptr = ptr;
        Error2Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Error2Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_error_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.error_message(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Error2.prototype[Symbol.dispose] = Error2.prototype.free;
export { Error2 as Error }

/**
 * A blake-2b hash digest of 28 bytes (224 bits)
 */
export class Hash28 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Hash28.prototype);
        obj.__wbg_ptr = ptr;
        Hash28Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Hash28Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hash28_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.hash28_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Hash28.prototype[Symbol.dispose] = Hash28.prototype.free;

/**
 * A blake-2b hash digest of 32 bytes (256 bits)
 */
export class Hash32 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Hash32.prototype);
        obj.__wbg_ptr = ptr;
        Hash32Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Hash32Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hash32_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.hash32_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Hash32.prototype[Symbol.dispose] = Hash32.prototype.free;

/**
 * A reference to a past transaction output.
 */
export class Input {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Input.prototype);
        obj.__wbg_ptr = ptr;
        InputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InputFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_input_free(ptr, 0);
    }
    /**
     * @param {Hash32} transaction_id
     * @param {bigint} output_index
     */
    constructor(transaction_id, output_index) {
        _assertClass(transaction_id, Hash32);
        const ret = wasm.input__wasm_new(transaction_id.__wbg_ptr, output_index);
        this.__wbg_ptr = ret >>> 0;
        InputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get outputIndex() {
        const ret = wasm.input_outputIndex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {Hash32}
     */
    get transactionId() {
        const ret = wasm.input_transactionId(this.__wbg_ptr);
        return Hash32.__wrap(ret);
    }
}
if (Symbol.dispose) Input.prototype[Symbol.dispose] = Input.prototype.free;

/**
 * An `Input` alongside its resolved `Output`
 */
export class InputSummary {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(InputSummary.prototype);
        obj.__wbg_ptr = ptr;
        InputSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InputSummaryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_inputsummary_free(ptr, 0);
    }
    /**
     * @returns {Input}
     */
    get input() {
        const ret = wasm.inputsummary_input(this.__wbg_ptr);
        return Input.__wrap(ret);
    }
    /**
     * @returns {OutputSummary}
     */
    get output() {
        const ret = wasm.inputsummary_output(this.__wbg_ptr);
        return OutputSummary.__wrap(ret);
    }
}
if (Symbol.dispose) InputSummary.prototype[Symbol.dispose] = InputSummary.prototype.free;

/**
 * A parsed Bolt11 invoice
 */
export class Invoice {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Invoice.prototype);
        obj.__wbg_ptr = ptr;
        InvoiceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InvoiceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_invoice_free(ptr, 0);
    }
    /**
     * @returns {Lock}
     */
    get lock() {
        const ret = wasm.invoice_lock(this.__wbg_ptr);
        return Lock.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.invoice_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} value
     * @returns {Invoice}
     */
    static tryParse(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.invoice_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Invoice.__wrap(ret[0]);
    }
}
if (Symbol.dispose) Invoice.prototype[Symbol.dispose] = Invoice.prototype.free;

/**
 * A 'black-box' API for Konduit L1 & L2 operations.
 */
export class Konduit {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KonduitFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_konduit_free(ptr, 0);
    }
    /**
     * Configure an (unauthenticated) adaptor, without a defined tag yet. Suitable to get the
     * adaptor info and other non-authenticated operations.
     * @returns {AdaptorInfo}
     */
    get adaptorInfo() {
        const ret = wasm.konduit_adaptorInfo(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AdaptorInfo.__wrap(ret[0]);
    }
    /**
     * Add funds to an existing channel.
     * @param {bigint} amount
     * @returns {Promise<Hash32>}
     */
    addToChannel(amount) {
        const ret = wasm.konduit_addToChannel(this.__wbg_ptr, amount);
        return ret;
    }
    /**
     * Find channels that belongs to "us"
     * @returns {Promise<ChannelOutput[]>}
     */
    channels() {
        const ret = wasm.konduit_channels(this.__wbg_ptr);
        return ret;
    }
    /**
     * Close the currently active channel, if any.
     * @returns {Promise<Hash32>}
     */
    closeChannel() {
        const ret = wasm.konduit_closeChannel(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get a reference to the connector.
     * @returns {Connector}
     */
    get connector() {
        const ret = wasm.konduit_connector(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Connector.__wrap(ret[0]);
    }
    /**
     * Get a quote for a given Bolt11 invoice from the adapator.
     * @param {Invoice} invoice
     * @returns {Promise<Quote>}
     */
    getQuoteFor(invoice) {
        _assertClass(invoice, Invoice);
        const ret = wasm.konduit_getQuoteFor(this.__wbg_ptr, invoice.__wbg_ptr);
        return ret;
    }
    /**
     * Current network id for which the app is configured.
     * @returns {NetworkId}
     */
    get networkId() {
        const ret = wasm.konduit_networkId(this.__wbg_ptr);
        return NetworkId.__wrap(ret);
    }
    /**
     * Restore an instance from a signing key. Everything else (connector, adaptor, ...) is
     * initially NOT configured.
     *
     * Note that this take ownership of the signing key /!\, to prevent it from leaking elsewhere
     * afterwards.
     * @param {NetworkId} network_id
     * @param {ShelleyAddress} script_deployment_address
     * @param {SigningKey} signing_key
     */
    constructor(network_id, script_deployment_address, signing_key) {
        _assertClass(network_id, NetworkId);
        _assertClass(script_deployment_address, ShelleyAddress);
        _assertClass(signing_key, SigningKey);
        var ptr0 = signing_key.__destroy_into_raw();
        const ret = wasm.konduit_new(network_id.__wbg_ptr, script_deployment_address.__wbg_ptr, ptr0);
        this.__wbg_ptr = ret >>> 0;
        KonduitFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Open a channel with the given tag and initial deposit.
     * @param {Tag} tag
     * @param {bigint} amount
     * @returns {Promise<Hash32>}
     */
    openChannel(tag, amount) {
        _assertClass(tag, Tag);
        const ret = wasm.konduit_openChannel(this.__wbg_ptr, tag.__wbg_ptr, amount);
        return ret;
    }
    /**
     * Pay an invoice using a previously established quote.
     * @param {PaymentRequest} request
     * @param {ConsumerState} state
     * @returns {Promise<SyncStatus>}
     */
    pay(request, state) {
        _assertClass(request, PaymentRequest);
        _assertClass(state, ConsumerState);
        const ret = wasm.konduit_pay(this.__wbg_ptr, request.__wbg_ptr, state.__wbg_ptr);
        return ret;
    }
    /**
     * Remove any existing channel tag
     */
    resetChannelTag() {
        const ret = wasm.konduit_resetChannelTag(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Recover a previously known tag, if any.
     * @param {Tag} tag
     */
    setChannelTag(tag) {
        _assertClass(tag, Tag);
        const ret = wasm.konduit_setChannelTag(this.__wbg_ptr, tag.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Configure an (unauthenticated) adaptor, without a defined tag yet. Suitable to get the
     * adaptor info and other non-authenticated operations.
     * @param {Adaptor} adaptor
     */
    set adaptor(adaptor) {
        _assertClass(adaptor, Adaptor);
        var ptr0 = adaptor.__destroy_into_raw();
        wasm.konduit_set_adaptor(this.__wbg_ptr, ptr0);
    }
    /**
     * Configure or reconfigure the associated connector for the instance.
     * @param {Connector} connector
     */
    set connector(connector) {
        _assertClass(connector, Connector);
        var ptr0 = connector.__destroy_into_raw();
        wasm.konduit_set_connector(this.__wbg_ptr, ptr0);
    }
    /**
     * Synchronize the channel with the adaptor.
     * @param {ConsumerState} state
     * @returns {Promise<SyncStatus>}
     */
    syncChannel(state) {
        _assertClass(state, ConsumerState);
        const ret = wasm.konduit_syncChannel(this.__wbg_ptr, state.__wbg_ptr);
        return ret;
    }
    /**
     * A handle on the underlying wallet.
     * @returns {Wallet}
     */
    get wallet() {
        const ret = wasm.konduit_wallet(this.__wbg_ptr);
        return Wallet.__wrap(ret);
    }
}
if (Symbol.dispose) Konduit.prototype[Symbol.dispose] = Konduit.prototype.free;

/**
 * The hash of an HTLC secret, awaiting a preimage.
 */
export class Lock {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Lock.prototype);
        obj.__wbg_ptr = ptr;
        LockFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LockFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_lock_free(ptr, 0);
    }
    /**
     * @param {Lock} other
     * @returns {boolean}
     */
    equals(other) {
        _assertClass(other, Lock);
        const ret = wasm.lock_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.lock_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} value
     * @returns {Lock}
     */
    static tryParse(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.lock_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Lock.__wrap(ret[0]);
    }
}
if (Symbol.dispose) Lock.prototype[Symbol.dispose] = Lock.prototype.free;

/**
 * A log level to configure the logger.
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const LogLevel = Object.freeze({
    Trace: 0, "0": "Trace",
    Debug: 1, "1": "Debug",
    Info: 2, "2": "Info",
    Warn: 3, "3": "Warn",
    Error: 4, "4": "Error",
});

/**
 * A network identifier to protect misuses of addresses or transactions on a wrong network.
 */
export class NetworkId {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NetworkId.prototype);
        obj.__wbg_ptr = ptr;
        NetworkIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NetworkIdFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_networkid_free(ptr, 0);
    }
    /**
     * @returns {NetworkId}
     */
    static mainnet() {
        const ret = wasm.networkid_mainnet();
        return NetworkId.__wrap(ret);
    }
    /**
     * @returns {NetworkId}
     */
    static testnet() {
        const ret = wasm.networkid_testnet();
        return NetworkId.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.networkid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) NetworkId.prototype[Symbol.dispose] = NetworkId.prototype.free;

/**
 * A transaction output, which comprises of at least an Address and a Value.
 */
export class Output {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OutputFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_output_free(ptr, 0);
    }
}
if (Symbol.dispose) Output.prototype[Symbol.dispose] = Output.prototype.free;

/**
 * An `Output` that carries only reference scripts as hashes, and not plain scripts.
 */
export class OutputSummary {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OutputSummary.prototype);
        obj.__wbg_ptr = ptr;
        OutputSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OutputSummaryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_outputsummary_free(ptr, 0);
    }
    /**
     * @returns {ShelleyAddress}
     */
    get address() {
        const ret = wasm.outputsummary_address(this.__wbg_ptr);
        return ShelleyAddress.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get lovelace() {
        const ret = wasm.outputsummary_lovelace(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {Hash28 | undefined}
     */
    get script() {
        const ret = wasm.outputsummary_script(this.__wbg_ptr);
        return ret === 0 ? undefined : Hash28.__wrap(ret);
    }
}
if (Symbol.dispose) OutputSummary.prototype[Symbol.dispose] = OutputSummary.prototype.free;

/**
 * A wrapper around a quote and an invoice ensuring that some checks have happened.
 */
export class PaymentRequest {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PaymentRequest.prototype);
        obj.__wbg_ptr = ptr;
        PaymentRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PaymentRequestFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paymentrequest_free(ptr, 0);
    }
}
if (Symbol.dispose) PaymentRequest.prototype[Symbol.dispose] = PaymentRequest.prototype.free;

/**
 * Proposed price and routing fee by an Adaptor for a given Bolt11 invoice.
 */
export class Quote {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Quote.prototype);
        obj.__wbg_ptr = ptr;
        QuoteFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QuoteFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_quote_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.quote_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {bigint}
     */
    get index() {
        const ret = wasm.quote_index(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {bigint}
     */
    get relativeTimeout() {
        const ret = wasm.quote_relativeTimeout(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {bigint}
     */
    get routingFee() {
        const ret = wasm.quote_routingFee(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
if (Symbol.dispose) Quote.prototype[Symbol.dispose] = Quote.prototype.free;

/**
 * An `Address`, specialized to the `Shelley` kind.
 */
export class ShelleyAddress {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShelleyAddress.prototype);
        obj.__wbg_ptr = ptr;
        ShelleyAddressFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShelleyAddressFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shelleyaddress_free(ptr, 0);
    }
    /**
     * @returns {Credential | undefined}
     */
    get delegationCredential() {
        const ret = wasm.shelleyaddress_delegationCredential(this.__wbg_ptr);
        return ret === 0 ? undefined : Credential.__wrap(ret);
    }
    /**
     * @param {ShelleyAddress} other
     * @returns {boolean}
     */
    equals(other) {
        _assertClass(other, ShelleyAddress);
        const ret = wasm.shelleyaddress_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Credential}
     */
    get paymentCredential() {
        const ret = wasm.shelleyaddress_paymentCredential(this.__wbg_ptr);
        return Credential.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.shelleyaddress_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} addr
     * @returns {ShelleyAddress}
     */
    static tryParse(addr) {
        const ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.shelleyaddress_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ShelleyAddress.__wrap(ret[0]);
    }
}
if (Symbol.dispose) ShelleyAddress.prototype[Symbol.dispose] = ShelleyAddress.prototype.free;

/**
 * An Ed25519 signing key (non-extended).
 */
export class SigningKey {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SigningKey.prototype);
        obj.__wbg_ptr = ptr;
        SigningKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SigningKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signingkey_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.signingkey__wasm_new();
        this.__wbg_ptr = ret >>> 0;
        SigningKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.signingkey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} value
     * @returns {SigningKey}
     */
    static tryParse(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signingkey_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SigningKey.__wrap(ret[0]);
    }
}
if (Symbol.dispose) SigningKey.prototype[Symbol.dispose] = SigningKey.prototype.free;

/**
 * A summary of a syncChannel operation.
 */
export class SyncStatus {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SyncStatus.prototype);
        obj.__wbg_ptr = ptr;
        SyncStatusFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SyncStatusFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_syncstatus_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get owed() {
        const ret = wasm.__wbg_get_syncstatus_owed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set owed(arg0) {
        wasm.__wbg_set_syncstatus_owed(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {BigUint64Array}
     */
    get locked() {
        const ret = wasm.syncstatus_locked(this.__wbg_ptr);
        var v1 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * @returns {BigUint64Array}
     */
    get squashed() {
        const ret = wasm.syncstatus_squashed(this.__wbg_ptr);
        var v1 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
}
if (Symbol.dispose) SyncStatus.prototype[Symbol.dispose] = SyncStatus.prototype.free;

/**
 * An up-to-32-bytes tag to allow reuse of `VerificationKey` across channels.
 */
export class Tag {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Tag.prototype);
        obj.__wbg_ptr = ptr;
        TagFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TagFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tag_free(ptr, 0);
    }
    /**
     * @param {number} length
     * @returns {Tag}
     */
    static generate(length) {
        const ret = wasm.tag_generate(length);
        return Tag.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tag_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} value
     * @returns {Tag}
     */
    static tryParse(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.tag_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Tag.__wrap(ret[0]);
    }
}
if (Symbol.dispose) Tag.prototype[Symbol.dispose] = Tag.prototype.free;

/**
 * A synthetic representation of a transaction used by the Connector.
 */
export class TransactionSummary {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionSummary.prototype);
        obj.__wbg_ptr = ptr;
        TransactionSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionSummaryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionsummary_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get depth() {
        const ret = wasm.transactionsummary_depth(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {string} s
     * @returns {TransactionSummary}
     */
    static deserialise(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.transactionsummary_deserialise(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return TransactionSummary.__wrap(ret[0]);
    }
    /**
     * @returns {Hash32}
     */
    get id() {
        const ret = wasm.transactionsummary_id(this.__wbg_ptr);
        return Hash32.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get index() {
        const ret = wasm.transactionsummary_index(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {InputSummary[]}
     */
    get inputs() {
        const ret = wasm.transactionsummary_inputs(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {OutputSummary[]}
     */
    get outputs() {
        const ret = wasm.transactionsummary_outputs(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    serialise() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionsummary_serialise(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {Date}
     */
    get timestamp() {
        const ret = wasm.transactionsummary_timestamp(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) TransactionSummary.prototype[Symbol.dispose] = TransactionSummary.prototype.free;

/**
 * An Ed25519 verification key (non-extended).
 */
export class VerificationKey {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerificationKey.prototype);
        obj.__wbg_ptr = ptr;
        VerificationKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerificationKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verificationkey_free(ptr, 0);
    }
    /**
     * Encode the `VerificationKey` as a 64-digit hex-encoded text string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.verificationkey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Construct a `VerificationKey` from a 64-digit hex-encoded text string. Throws if the
     * string is malformed.
     * @param {string} value
     * @returns {VerificationKey}
     */
    static tryParse(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.verificationkey_tryParse(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return VerificationKey.__wrap(ret[0]);
    }
}
if (Symbol.dispose) VerificationKey.prototype[Symbol.dispose] = VerificationKey.prototype.free;

/**
 * A rudimentary wallet interface
 */
export class Wallet {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Wallet.prototype);
        obj.__wbg_ptr = ptr;
        WalletFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wallet_free(ptr, 0);
    }
    /**
     * @returns {ShelleyAddress}
     */
    get address() {
        const ret = wasm.wallet_address(this.__wbg_ptr);
        return ShelleyAddress.__wrap(ret);
    }
    /**
     * Retrieve the balance of the underlying L1 wallet.
     * @param {Connector} connector
     * @returns {Promise<bigint>}
     */
    balance(connector) {
        _assertClass(connector, Connector);
        const ret = wasm.wallet_balance(this.__wbg_ptr, connector.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ShelleyAddress | undefined}
     */
    get exitAddress() {
        const ret = wasm.wallet_exitAddress(this.__wbg_ptr);
        return ret === 0 ? undefined : ShelleyAddress.__wrap(ret);
    }
    /**
     * @returns {Credential}
     */
    get paymentCredential() {
        const ret = wasm.wallet_paymentCredential(this.__wbg_ptr);
        return Credential.__wrap(ret);
    }
    resetExitAddress() {
        wasm.wallet_resetExitAddress(this.__wbg_ptr);
    }
    resetStakeCredential() {
        wasm.wallet_resetStakeCredential(this.__wbg_ptr);
    }
    /**
     * @param {ShelleyAddress} exit_address
     */
    set exitAddress(exit_address) {
        _assertClass(exit_address, ShelleyAddress);
        wasm.wallet_set_exitAddress(this.__wbg_ptr, exit_address.__wbg_ptr);
    }
    /**
     * @param {Credential} stake_credential
     */
    set stakeCredential(stake_credential) {
        _assertClass(stake_credential, Credential);
        wasm.wallet_set_stakeCredential(this.__wbg_ptr, stake_credential.__wbg_ptr);
    }
    /**
     * @returns {Credential | undefined}
     */
    get stakeCredential() {
        const ret = wasm.wallet_stakeCredential(this.__wbg_ptr);
        return ret === 0 ? undefined : Credential.__wrap(ret);
    }
    /**
     * Retrieve the transaction activity around the underlying L1 wallet. This includes channels
     * opening and closing, but not intermediate operation on channels that do not involve the
     * wallet.
     * @param {Connector} connector
     * @returns {Promise<TransactionSummary[]>}
     */
    transactions(connector) {
        _assertClass(connector, Connector);
        const ret = wasm.wallet_transactions(this.__wbg_ptr, connector.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {VerificationKey}
     */
    get verificationKey() {
        const ret = wasm.wallet_verificationKey(this.__wbg_ptr);
        return VerificationKey.__wrap(ret);
    }
}
if (Symbol.dispose) Wallet.prototype[Symbol.dispose] = Wallet.prototype.free;

/**
 * To be called once in the application life-cycle to make logs from Rust/Wasm displayed in the
 * browser console, and to install a hook on Rust internal panics in order to make them bubble as
 * plain JavaScript errors.
 * @param {LogLevel} level
 */
export function enableLogsAndPanicHook(level) {
    const ret = wasm.enableLogsAndPanicHook(level);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}
export function __wbg_Error_8c4e43fe74559d73(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_debug_string_0bc8482c6e3508ae(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_is_function_0095a73b8b156f76(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
}
export function __wbg___wbindgen_is_object_5ae8e5880f2c1fbd(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
}
export function __wbg___wbindgen_is_string_cd444516edc5b180(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
}
export function __wbg___wbindgen_is_undefined_9e4d92534c42d778(arg0) {
    const ret = arg0 === undefined;
    return ret;
}
export function __wbg___wbindgen_string_get_72fb696202c56729(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_throw_be289d5034ed271b(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbg__wbg_cb_unref_d9b87ff7982e3b21(arg0) {
    arg0._wbg_cb_unref();
}
export function __wbg_abort_2f0584e03e8e3950(arg0) {
    arg0.abort();
}
export function __wbg_adaptor_new(arg0) {
    const ret = Adaptor.__wrap(arg0);
    return ret;
}
export function __wbg_call_389efe28435a9388() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments); }
export function __wbg_call_4708e0c13bdc8e95() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments); }
export function __wbg_channeloutput_new(arg0) {
    const ret = ChannelOutput.__wrap(arg0);
    return ret;
}
export function __wbg_clearTimeout_5a54f8841c30079a(arg0) {
    const ret = clearTimeout(arg0);
    return ret;
}
export function __wbg_connector_new(arg0) {
    const ret = Connector.__wrap(arg0);
    return ret;
}
export function __wbg_crypto_574e78ad8b13b65f(arg0) {
    const ret = arg0.crypto;
    return ret;
}
export function __wbg_debug_a4099fa12db6cd61(arg0) {
    console.debug(arg0);
}
export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
}
export function __wbg_error_9a7fe3f932034cde(arg0) {
    console.error(arg0);
}
export function __wbg_error_new(arg0) {
    const ret = Error2.__wrap(arg0);
    return ret;
}
export function __wbg_fetch_a9bc66c159c18e19(arg0) {
    const ret = fetch(arg0);
    return ret;
}
export function __wbg_getRandomValues_b8f5dbd5f3995a9e() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments); }
export function __wbg_hash32_new(arg0) {
    const ret = Hash32.__wrap(arg0);
    return ret;
}
export function __wbg_info_148d043840582012(arg0) {
    console.info(arg0);
}
export function __wbg_inputsummary_new(arg0) {
    const ret = InputSummary.__wrap(arg0);
    return ret;
}
export function __wbg_instanceof_Error_8573fe0b0b480f46(arg0) {
    let result;
    try {
        result = arg0 instanceof Error;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Response_ee1d54d79ae41977(arg0) {
    let result;
    try {
        result = arg0 instanceof Response;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_length_32ed9a279acd054c(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_log_6b5ca2e6124b2808(arg0) {
    console.log(arg0);
}
export function __wbg_message_9ddc4b9a62a7c379(arg0) {
    const ret = arg0.message;
    return ret;
}
export function __wbg_method_a9e9b2fcba5440fb(arg0, arg1) {
    const ret = arg1.method;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg_msCrypto_a61aeb35a24c1329(arg0) {
    const ret = arg0.msCrypto;
    return ret;
}
export function __wbg_name_446e25ef2cfdab5a(arg0) {
    const ret = arg0.name;
    return ret;
}
export function __wbg_new_074b505417ada2d9() { return handleError(function () {
    const ret = new URLSearchParams();
    return ret;
}, arguments); }
export function __wbg_new_245cd5c49157e602(arg0) {
    const ret = new Date(arg0);
    return ret;
}
export function __wbg_new_361308b2356cecd0() {
    const ret = new Object();
    return ret;
}
export function __wbg_new_3eb36ae241fe6f44() {
    const ret = new Array();
    return ret;
}
export function __wbg_new_64284bd487f9d239() { return handleError(function () {
    const ret = new Headers();
    return ret;
}, arguments); }
export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
}
export function __wbg_new_b5d9e2fb389fef91(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen__convert__closures_____invoke__h3b1d7a705b6aee02(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
}
export function __wbg_new_b949e7f56150a5d1() { return handleError(function () {
    const ret = new AbortController();
    return ret;
}, arguments); }
export function __wbg_new_c2f21774701ddac7() { return handleError(function (arg0, arg1) {
    const ret = new URL(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments); }
export function __wbg_new_from_slice_a3d2629dc1826784(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_new_no_args_1c7c842f08d00ebb(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_new_with_length_a2c39cbe88fd8ff1(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
}
export function __wbg_new_with_str_a7c7f835549b152a() { return handleError(function (arg0, arg1) {
    const ret = new Request(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments); }
export function __wbg_new_with_str_and_init_a61cbc6bdef21614() { return handleError(function (arg0, arg1, arg2) {
    const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
    return ret;
}, arguments); }
export function __wbg_node_905d3e251edff8a2(arg0) {
    const ret = arg0.node;
    return ret;
}
export function __wbg_now_a3af9a2f4bbaa4d1() {
    const ret = Date.now();
    return ret;
}
export function __wbg_ok_87f537440a0acf85(arg0) {
    const ret = arg0.ok;
    return ret;
}
export function __wbg_outputsummary_new(arg0) {
    const ret = OutputSummary.__wrap(arg0);
    return ret;
}
export function __wbg_process_dc0fbacc7c1c06f7(arg0) {
    const ret = arg0.process;
    return ret;
}
export function __wbg_prototypesetcall_bdcdcc5842e4d77d(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
}
export function __wbg_queueMicrotask_0aa0a927f78f5d98(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
}
export function __wbg_queueMicrotask_5bb536982f78a56f(arg0) {
    queueMicrotask(arg0);
}
export function __wbg_quote_new(arg0) {
    const ret = Quote.__wrap(arg0);
    return ret;
}
export function __wbg_randomFillSync_ac0988aba3254290() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments); }
export function __wbg_require_60cc747a6bc5215a() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments); }
export function __wbg_resolve_002c4b7d9d8f6b64(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
}
export function __wbg_search_143f09a35047e800(arg0, arg1) {
    const ret = arg1.search;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg_setTimeout_db2dbaeefb6f39c7() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
}
export function __wbg_set_body_9a7e00afe3cfe244(arg0, arg1) {
    arg0.body = arg1;
}
export function __wbg_set_db769d02949a271d() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments); }
export function __wbg_set_f43e577aea94465b(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
}
export function __wbg_set_headers_cfc5f4b2c1f20549(arg0, arg1) {
    arg0.headers = arg1;
}
export function __wbg_set_method_c3e20375f5ae7fac(arg0, arg1, arg2) {
    arg0.method = getStringFromWasm0(arg1, arg2);
}
export function __wbg_set_search_1d369b0f3868e132(arg0, arg1, arg2) {
    arg0.search = getStringFromWasm0(arg1, arg2);
}
export function __wbg_set_signal_f2d3f8599248896d(arg0, arg1) {
    arg0.signal = arg1;
}
export function __wbg_signal_d1285ecab4ebc5ad(arg0) {
    const ret = arg0.signal;
    return ret;
}
export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg_static_accessor_GLOBAL_12837167ad935116() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_SELF_a621d3dfbb60d0ce() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_WINDOW_f8727f0cf888e0bd() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_status_89d7e803db911ee7(arg0) {
    const ret = arg0.status;
    return ret;
}
export function __wbg_stringify_8d1cc6ff383e8bae() { return handleError(function (arg0) {
    const ret = JSON.stringify(arg0);
    return ret;
}, arguments); }
export function __wbg_subarray_a96e1fef17ed23cb(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
}
export function __wbg_syncstatus_new(arg0) {
    const ret = SyncStatus.__wrap(arg0);
    return ret;
}
export function __wbg_text_083b8727c990c8c0() { return handleError(function (arg0) {
    const ret = arg0.text();
    return ret;
}, arguments); }
export function __wbg_then_0d9fe2c7b1857d32(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
}
export function __wbg_then_b9e7b3b5f1a9e1b5(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
}
export function __wbg_toString_029ac24421fd7a24(arg0) {
    const ret = arg0.toString();
    return ret;
}
export function __wbg_toString_964ff7fe6eca8362(arg0) {
    const ret = arg0.toString();
    return ret;
}
export function __wbg_transactionsummary_new(arg0) {
    const ret = TransactionSummary.__wrap(arg0);
    return ret;
}
export function __wbg_url_36c39f6580d05409(arg0, arg1) {
    const ret = arg1.url;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg_versions_c01dfd4722a88165(arg0) {
    const ret = arg0.versions;
    return ret;
}
export function __wbg_warn_f7ae1b2e66ccb930(arg0) {
    console.warn(arg0);
}
export function __wbindgen_cast_0000000000000001(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 162, function: Function { arguments: [Externref], shim_idx: 328, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h38b73bdc30f2e5f8, wasm_bindgen__convert__closures_____invoke__hdf9be3f5e7349612);
    return ret;
}
export function __wbindgen_cast_0000000000000002(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 162, function: Function { arguments: [], shim_idx: 163, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h38b73bdc30f2e5f8, wasm_bindgen__convert__closures_____invoke__h8f6e01f021267a54);
    return ret;
}
export function __wbindgen_cast_0000000000000003(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
}
export function __wbindgen_cast_0000000000000004(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
    const ret = getArrayU8FromWasm0(arg0, arg1);
    return ret;
}
export function __wbindgen_cast_0000000000000005(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
}
export function __wbindgen_cast_0000000000000006(arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return ret;
}
export function __wbindgen_cast_0000000000000007(arg0, arg1) {
    var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_free(arg0, arg1 * 4, 4);
    // Cast intrinsic for `Vector(NamedExternref("ChannelOutput")) -> Externref`.
    const ret = v0;
    return ret;
}
export function __wbindgen_cast_0000000000000008(arg0, arg1) {
    var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_free(arg0, arg1 * 4, 4);
    // Cast intrinsic for `Vector(NamedExternref("TransactionSummary")) -> Externref`.
    const ret = v0;
    return ret;
}
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
function wasm_bindgen__convert__closures_____invoke__h8f6e01f021267a54(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h8f6e01f021267a54(arg0, arg1);
}

function wasm_bindgen__convert__closures_____invoke__hdf9be3f5e7349612(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__hdf9be3f5e7349612(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h3b1d7a705b6aee02(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures_____invoke__h3b1d7a705b6aee02(arg0, arg1, arg2, arg3);
}

const AdaptorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_adaptor_free(ptr >>> 0, 1));
const AdaptorInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_adaptorinfo_free(ptr >>> 0, 1));
const ChannelOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_channeloutput_free(ptr >>> 0, 1));
const ConnectorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_connector_free(ptr >>> 0, 1));
const ConsumerStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_consumerstate_free(ptr >>> 0, 1));
const CredentialFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_credential_free(ptr >>> 0, 1));
const Error2Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_error_free(ptr >>> 0, 1));
const Hash28Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hash28_free(ptr >>> 0, 1));
const Hash32Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hash32_free(ptr >>> 0, 1));
const InputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_input_free(ptr >>> 0, 1));
const InputSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_inputsummary_free(ptr >>> 0, 1));
const InvoiceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_invoice_free(ptr >>> 0, 1));
const KonduitFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_konduit_free(ptr >>> 0, 1));
const LockFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_lock_free(ptr >>> 0, 1));
const NetworkIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_networkid_free(ptr >>> 0, 1));
const OutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_output_free(ptr >>> 0, 1));
const OutputSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_outputsummary_free(ptr >>> 0, 1));
const PaymentRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paymentrequest_free(ptr >>> 0, 1));
const QuoteFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_quote_free(ptr >>> 0, 1));
const ShelleyAddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_shelleyaddress_free(ptr >>> 0, 1));
const SigningKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signingkey_free(ptr >>> 0, 1));
const SyncStatusFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_syncstatus_free(ptr >>> 0, 1));
const TagFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tag_free(ptr >>> 0, 1));
const TransactionSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionsummary_free(ptr >>> 0, 1));
const VerificationKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verificationkey_free(ptr >>> 0, 1));
const WalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wallet_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getBigUint64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedBigUint64ArrayMemory0 = null;
function getBigUint64ArrayMemory0() {
    if (cachedBigUint64ArrayMemory0 === null || cachedBigUint64ArrayMemory0.byteLength === 0) {
        cachedBigUint64ArrayMemory0 = new BigUint64Array(wasm.memory.buffer);
    }
    return cachedBigUint64ArrayMemory0;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
