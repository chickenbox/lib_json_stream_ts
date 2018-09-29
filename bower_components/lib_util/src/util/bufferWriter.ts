namespace org {
    export namespace chox {
        export namespace util {

            export class BufferedWriter {
                private _buffer: ArrayBuffer
                private dataView: DataView
                private _offset = 0
                private textEncoder: TextEncoder

                get buffer() {
                    return this._buffer
                }

                get length() {
                    return this._offset
                }

                constructor(
                    initialBufferSize: number = 1,
                    stringEncoding: string = "utf-8"
                ) {
                    this._buffer = new ArrayBuffer( initialBufferSize )
                    this.dataView = new DataView( this._buffer )
                    this.textEncoder = new TextEncoder(stringEncoding)
                }

                private resize( size: number ) {
                    if ( this._buffer.byteLength != size ) {
                        const newBuf = new ArrayBuffer( size )
                        new Uint8Array( newBuf ).set( new Uint8Array( this._buffer ) )
                        this._buffer = newBuf
                        this.dataView = new DataView( newBuf )
                    }
                }

                private enlargeBy( size: number ) {
                    var s = this._buffer.byteLength
                    while ( s < this._offset + size ) {
                        s *= 2
                    }
                    this.resize( s )
                }

                reset() {
                    this._offset = 0
                }

                writeInt8( i: number ) {
                    this.enlargeBy( 1 )
                    this.dataView.setInt8( this._offset, i )
                    this._offset += 1
                }

                writeUint8( i: number ) {
                    this.enlargeBy( 1 )
                    this.dataView.setUint8( this._offset, i )
                    this._offset += 1
                }

                writeInt16( i: number ) {
                    this.enlargeBy( 2 )
                    this.dataView.setInt16( this._offset, i )
                    this._offset += 2
                }

                writeInt32( i: number ) {
                    this.enlargeBy( 4 )
                    this.dataView.setInt32( this._offset, i )
                    this._offset += 4
                }

                writeFloat32( f: number ) {
                    this.enlargeBy( 4 )
                    this.dataView.setFloat32( this._offset, f )
                    this._offset += 4
                }

                writeFloat64( f: number ) {
                    this.enlargeBy( 8 )
                    this.dataView.setFloat64( this._offset, f )
                    this._offset += 8
                }

                writeBool( b: boolean ) {
                    this.enlargeBy( 1 )
                    this.dataView.setUint8( this._offset, b ? 1 : 0 )
                    this._offset += 1
                }

                writeBytes( bytes: Uint8Array, writeLen: boolean = true ) {
                    if ( writeLen )
                        this.writeInt32( bytes.byteLength )
                    this.enlargeBy( bytes.byteLength )
                    new Uint8Array( this._buffer, this._offset, bytes.byteLength ).set( bytes )
                    this._offset += bytes.byteLength
                }

                writeTinyString( s: string ) {
                    const bytes = this.textEncoder.encode( s )
                    this.writeUint8( bytes.byteLength )
                    this.enlargeBy( bytes.byteLength )
                    new Uint8Array( this._buffer, this._offset, bytes.byteLength ).set( bytes )
                    this._offset += bytes.byteLength
                }

                writeString( s: string ) {
                    this.writeBytes( this.textEncoder.encode( s ) )
                }
            }
        }
    }
}
