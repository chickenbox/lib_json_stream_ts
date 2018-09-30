namespace org {
    export namespace chickenbox {
        export namespace buffer {

            export class Reader {
                private dataView: DataView
                private offset = 0
                private textDecoder: TextDecoder

                constructor(
                    private readonly buffer: ArrayBuffer,
                    stringEncoding: string = "utf-8"
                ) {
                    this.dataView = new DataView( buffer )
                    this.textDecoder = new TextDecoder( stringEncoding )
                }

                get int8() {
                    const i = this.dataView.getInt8( this.offset )
                    this.offset += 1
                    return i
                }

                get uint8() {
                    const i = this.dataView.getUint8( this.offset )
                    this.offset += 1
                    return i
                }

                get int16() {
                    const i = this.dataView.getInt16( this.offset )
                    this.offset += 2
                    return i
                }

                get int32() {
                    const i = this.dataView.getInt32( this.offset )
                    this.offset += 4
                    return i
                }

                get float32() {
                    const f = this.dataView.getFloat32( this.offset )
                    this.offset += 4
                    return f
                }

                get float64() {
                    const f = this.dataView.getFloat64( this.offset )
                    this.offset += 8
                    return f
                }

                get bool() {
                    const i = this.dataView.getUint8( this.offset )
                    this.offset += 1
                    return i == 1
                }

                get bytes() {
                    const len = this.int32
                    const bytes = this.buffer.slice( this.offset, this.offset + len )
                    this.offset += len
                    return bytes
                }

                get string() {
                    const len = this.int32
                    const s = this.textDecoder.decode( new Uint8Array( this.buffer, this.offset, len ) )
                    this.offset += len
                    return s
                }

                get tinyString() {
                    const len = this.uint8
                    const s = this.textDecoder.decode( new Uint8Array( this.buffer, this.offset, len ) )
                    this.offset += len
                    return s
                }
            }
        }
    }
}
