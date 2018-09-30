namespace org {
    export namespace chickenbox {
        export namespace buffer {
            export class Util {
                public static readFrom( url: string, completion: (buffer?: ArrayBuffer, lastModified?: Date)=>void ){
                    const xhr = new XMLHttpRequest()
                    xhr.open("GET", url, true)
                    xhr.responseType = "arraybuffer"
                    xhr.onreadystatechange = (): void =>{
                      switch(xhr.readyState){
                      case 4:
                        switch( xhr.status ){
                        case 200:            
                            var lastModified: Date | undefined
                            const s = xhr.getResponseHeader("Last-Modified")
                            if(s) lastModified = new Date(Date.parse(s))
                            completion(xhr.response, lastModified)
                            break
                        default:
                            completion()
                            break
                        }
                        break
                      }
                    }
                    xhr.onerror = (): void => {
                      completion()
                    }
                    xhr.onload = (): void => {
                      switch( xhr.status ){
                      case 404:
                        completion()
                      }
                    }
                    xhr.send()
                }
            }
        }
    }
}


Object.defineProperty( ArrayBuffer, "chickenbox", {
    get: function() {
        return org.chickenbox.buffer.Util
    }
} )
