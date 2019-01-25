//Consider adding some bitbuffer like functionality
//Also add some encapuslation if possible



let bitstream = function(startbytes) {
    
	if (startbytes instanceof Uint8Array) {
		this.buffer = startbytes
	}
	else {
    	startbytes = Math.max(startbytes, 1)
    	this.buffer = new Uint8Array(startbytes)	
	}
	
    
    
    this.bytenum = 0
    this.bitnum = 0
    
    this.writebit = function(value) {
        
        if (this.bitnum > 7) {
            this.bytenum++
            this.bitnum = 0
        }
        
        if (this.bytenum >= this.buffer.length) {
            //Increase size of buffer to avoid out of bounds write
            this.resize(this.buffer.length * 2)
        }
        
        
        //Set the bit to a zero if not already
        //It should already be a zero given that currently you can only go in streams
        this.buffer[this.bytenum] -= this.buffer[this.bytenum] & (1<<this.bitnum);
        
        //Set the bit to a one if needed
        this.buffer[this.bytenum] += value<<this.bitnum;        
        
        this.bitnum++
        
        return;
    }
    
    
    
    this.readbit = function() {
        
        if (this.bitnum > 7) {
            this.bytenum++
            this.bitnum = 0
        }
        
        if (this.bytenum >= this.buffer.length) {
            throw "Out of bounds read."
        }        
        
        let res = this.buffer[this.bytenum] & (1<<this.bitnum);
        
        this.bitnum++
        
        //Value will either be 0 or 1<<this.bitpos
        //As such, return 0 if res is 0, otherwise return 1
        if (res === 0) {
            return 0
        }
        
        return 1;
        
    }
    
    
    
    this.trim = function() {
        //Resize to used length (add one since start at 0) 
		let bytes = this.bytenum;
		//Don't include an extra byte if no bits in that byte have been written
		if (this.bitnum > 0) {
			bytes += 1
		}
        this.resize(bytes)
        return;
    }
    
    this.setposition = function(bytenum, bitnum) {
        //Check that this position wouldn't cause an out of bounds read/write
        this.bytenum = bytenum
        this.bitnum = bitnum
    }
    
    
    this.resize = function(bytes) {
        //Resizes buffer to bytes bytes
        
        if (typeof ArrayBuffer.transfer === "function") {            
            this.buffer = ArrayBuffer.transfer(this.buffer, bytes)
        }
        else if (bytes <= this.buffer.length) {
            this.buffer = this.buffer.slice(0, bytes);
        }
        else {
            let temp = new Uint8Array(bytes)
            temp.set(this.buffer)
            this.buffer = temp
        }
                
        return;
    }

}
