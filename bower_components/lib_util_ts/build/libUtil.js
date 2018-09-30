"use strict";
var org;
(function (org) {
    let chickenbox;
    (function (chickenbox) {
        let buffer;
        (function (buffer_1) {
            class Reader {
                constructor(buffer, stringEncoding = "utf-8") {
                    this.buffer = buffer;
                    this.offset = 0;
                    this.dataView = new DataView(buffer);
                    this.textDecoder = new TextDecoder(stringEncoding);
                }
                get int8() {
                    const i = this.dataView.getInt8(this.offset);
                    this.offset += 1;
                    return i;
                }
                get uint8() {
                    const i = this.dataView.getUint8(this.offset);
                    this.offset += 1;
                    return i;
                }
                get int16() {
                    const i = this.dataView.getInt16(this.offset);
                    this.offset += 2;
                    return i;
                }
                get int32() {
                    const i = this.dataView.getInt32(this.offset);
                    this.offset += 4;
                    return i;
                }
                get float32() {
                    const f = this.dataView.getFloat32(this.offset);
                    this.offset += 4;
                    return f;
                }
                get float64() {
                    const f = this.dataView.getFloat64(this.offset);
                    this.offset += 8;
                    return f;
                }
                get bool() {
                    const i = this.dataView.getUint8(this.offset);
                    this.offset += 1;
                    return i == 1;
                }
                get bytes() {
                    const len = this.int32;
                    const bytes = this.buffer.slice(this.offset, this.offset + len);
                    this.offset += len;
                    return bytes;
                }
                get string() {
                    const len = this.int32;
                    const s = this.textDecoder.decode(new Uint8Array(this.buffer, this.offset, len));
                    this.offset += len;
                    return s;
                }
                get tinyString() {
                    const len = this.uint8;
                    const s = this.textDecoder.decode(new Uint8Array(this.buffer, this.offset, len));
                    this.offset += len;
                    return s;
                }
            }
            buffer_1.Reader = Reader;
        })(buffer = chickenbox.buffer || (chickenbox.buffer = {}));
    })(chickenbox = org.chickenbox || (org.chickenbox = {}));
})(org || (org = {}));
var org;
(function (org) {
    let chickenbox;
    (function (chickenbox) {
        let buffer;
        (function (buffer) {
            class Writer {
                constructor(initialBufferSize = 1, stringEncoding = "utf-8") {
                    this._offset = 0;
                    this._buffer = new ArrayBuffer(initialBufferSize);
                    this.dataView = new DataView(this._buffer);
                    this.textEncoder = new TextEncoder(stringEncoding);
                }
                get buffer() {
                    return this._buffer;
                }
                get length() {
                    return this._offset;
                }
                resize(size) {
                    if (this._buffer.byteLength != size) {
                        const newBuf = new ArrayBuffer(size);
                        new Uint8Array(newBuf).set(new Uint8Array(this._buffer));
                        this._buffer = newBuf;
                        this.dataView = new DataView(newBuf);
                    }
                }
                enlargeBy(size) {
                    var s = this._buffer.byteLength;
                    while (s < this._offset + size) {
                        s *= 2;
                    }
                    this.resize(s);
                }
                reset() {
                    this._offset = 0;
                }
                writeInt8(i) {
                    this.enlargeBy(1);
                    this.dataView.setInt8(this._offset, i);
                    this._offset += 1;
                }
                writeUint8(i) {
                    this.enlargeBy(1);
                    this.dataView.setUint8(this._offset, i);
                    this._offset += 1;
                }
                writeInt16(i) {
                    this.enlargeBy(2);
                    this.dataView.setInt16(this._offset, i);
                    this._offset += 2;
                }
                writeInt32(i) {
                    this.enlargeBy(4);
                    this.dataView.setInt32(this._offset, i);
                    this._offset += 4;
                }
                writeFloat32(f) {
                    this.enlargeBy(4);
                    this.dataView.setFloat32(this._offset, f);
                    this._offset += 4;
                }
                writeFloat64(f) {
                    this.enlargeBy(8);
                    this.dataView.setFloat64(this._offset, f);
                    this._offset += 8;
                }
                writeBool(b) {
                    this.enlargeBy(1);
                    this.dataView.setUint8(this._offset, b ? 1 : 0);
                    this._offset += 1;
                }
                writeBytes(bytes, writeLen = true) {
                    if (writeLen)
                        this.writeInt32(bytes.byteLength);
                    this.enlargeBy(bytes.byteLength);
                    new Uint8Array(this._buffer, this._offset, bytes.byteLength).set(bytes);
                    this._offset += bytes.byteLength;
                }
                writeTinyString(s) {
                    const bytes = this.textEncoder.encode(s);
                    this.writeUint8(bytes.byteLength);
                    this.enlargeBy(bytes.byteLength);
                    new Uint8Array(this._buffer, this._offset, bytes.byteLength).set(bytes);
                    this._offset += bytes.byteLength;
                }
                writeString(s) {
                    this.writeBytes(this.textEncoder.encode(s));
                }
            }
            buffer.Writer = Writer;
        })(buffer = chickenbox.buffer || (chickenbox.buffer = {}));
    })(chickenbox = org.chickenbox || (org.chickenbox = {}));
})(org || (org = {}));
