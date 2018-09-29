namespace org {
    export namespace chox {
        export namespace json {

            enum DataType {
                byte,
                short,
                int32,
                float,
                double,
                boolean,
                string,
                array,
                object,
                null
            }

            export class InputStream {
                private propertyNames: string[] = []

                private _read( reader: util.BufferReader ): any {
                    switch ( reader.uint8 ) {
                        case DataType.byte:
                            return reader.int8
                        case DataType.short:
                            return reader.int16
                        case DataType.int32:
                            return reader.int32
                        case DataType.float:
                            return reader.float32
                        case DataType.double:
                            return reader.float64
                        case DataType.boolean:
                            return reader.bool
                        case DataType.string:
                            return reader.string
                        case DataType.array: {
                            const len = this._read( reader )
                            var a = []
                            for ( var i = 0; i < len; i++ ) {
                                a.push( this._read( reader ) )
                            }
                            return a
                        }
                        case DataType.null:
                            return null
                        default: {
                            var obj: any = {}
                            const len: number = this._read( reader )
                            for ( var i = 0; i < len; i++ ) {
                                const key = this.propertyNames[this._read( reader )]
                                obj[key] = this._read( reader )
                            }
                            return obj
                        }
                    }
                }

                read( buffer: ArrayBuffer ) {
                    const reader = new util.BufferReader( buffer )
                    const numKey: number = reader.int16
                    for ( var i = 0; i < numKey; i++ )
                        this.propertyNames.push( reader.tinyString )
                    return this._read( reader )
                }
            }

            export class OutputStream {
                private propertyNames: string[] = []
                private propertyIndexLookup = new Map<string, number>()

                private writer = new chox.util.BufferedWriter()
                private headerWriter = new chox.util.BufferedWriter()

                private index( key: string ): number {
                    if ( !this.propertyIndexLookup.has( key ) ) {
                        this.propertyNames.push( key )
                        this.propertyIndexLookup.set( key, this.propertyNames.length - 1 )
                    }
                    return this.propertyIndexLookup.get( key )!
                }

                private _write( json: any ) {
                    switch ( typeof json ) {
                        case "number":
                            if ( json % 1 == 0 ) {
                                if ( json >= -128 && json < 128 ) {
                                    this.writer.writeUint8( DataType.byte )
                                    this.writer.writeInt8( json )
                                } else if ( json >= -32768 && json < 32768 ) {
                                    this.writer.writeUint8( DataType.short )
                                    this.writer.writeInt16( json )
                                } else if ( json >= -2147483648 && json < 2147483648 ) {
                                    this.writer.writeUint8( DataType.int32 )
                                    this.writer.writeInt32( json )
                                } else {
                                    this.writer.writeUint8( DataType.double )
                                    this.writer.writeFloat64( json )
                                }
                            } else {
                                if ( Math.fround( json ) == json ) {
                                    this.writer.writeUint8( DataType.float )
                                    this.writer.writeFloat32( json )
                                } else {
                                    this.writer.writeUint8( DataType.double )
                                    this.writer.writeFloat64( json )
                                }
                            }
                            break
                        case "boolean":
                            this.writer.writeUint8( DataType.boolean )
                            this.writer.writeBool( json )
                            break
                        case "string":
                            this.writer.writeUint8( DataType.string )
                            this.writer.writeString( json )
                            break
                        default:
                            if ( json instanceof Array ) {
                                this.writer.writeUint8( DataType.array )
                                this._write( json.length )
                                for ( var v of json ) {
                                    this._write( v )
                                }
                            } else {
                                if ( json ) {
                                    this.writer.writeUint8( DataType.object )
                                    var allKeys: string[] = []
                                    for ( var key in json ) {
                                        if ( json.hasOwnProperty( key ) ) {
                                            allKeys.push( key )
                                        }
                                    }
                                    this._write( allKeys.length )
                                    for ( key of allKeys ) {
                                        const index = this.index( key )
                                        this._write( index )
                                        this._write( json[key] )
                                    }
                                } else {
                                    this.writer.writeUint8( DataType.null )
                                }
                            }
                    }
                }

                write( json: any ) {
                    const startIndex = this.propertyNames.length
                    this.writer.reset()
                    this.headerWriter.reset()
                    this._write( json )

                    this.headerWriter.writeInt16( this.propertyNames.length - startIndex )
                    for ( var i = startIndex; i < this.propertyNames.length; i++ ) {
                        this.headerWriter.writeTinyString( this.propertyNames[i] )
                    }

                    this.headerWriter.writeBytes( new Uint8Array( this.writer.buffer, 0, this.writer.length ), false )

                    return this.headerWriter.buffer.slice( 0, this.headerWriter.length )
                }
            }
        }
    }}