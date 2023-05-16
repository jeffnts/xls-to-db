import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConvertDto } from './dto/create-convert.dto';
import { Client } from 'pg'
import * as xlsx from 'xlsx'

@Injectable()
export class ConvertService {
  async create(createConvertDto: CreateConvertDto, file: Express.Multer.File) {
    const { databaseUrl, table, sheetName, uniqueField, offset = 0, limit = Infinity } = createConvertDto

    const supportedDatabases = ['postgres']

    if(!supportedDatabases.some(item => databaseUrl.includes(item))){
      throw new HttpException('Database not suported yet.', HttpStatus.NOT_ACCEPTABLE)
    }

    const wb =  xlsx.read(file.buffer, { dense: true })    

    const [sheet] = wb.SheetNames
    
    const ws = wb.Sheets[sheetName ?? sheet]

    function sheet_to_json_cb(ws: xlsx.WorkSheet, cb:(d:string|null)=>void, opts: xlsx.Sheet2CSVOpts = {}, batch = 1000) {
      xlsx.stream.set_readable(() => ({
        __done: false,

        _read: function() { this.__done = true; },

        push: function(data: any) { if(!this.__done) cb(data); if(data == null) this.__done = true; },

        resume: function pump() { for(var i = 0; i < batch && !this.__done; ++i) this._read(); if(!this.__done) setTimeout(pump.bind(this), 0); },
       
      }));
      return xlsx.stream.to_json(ws, opts);
    } 

    const json = []

    async function saveToDatabase(data: any){
      if(!data) return 
          
      json.push(data)
    }

    sheet_to_json_cb(ws, saveToDatabase).resume()
    

    const uniques = `(${json.map((item) => `'${item[uniqueField]}'`).join(',')})`

    const fields = `(${Object.keys(json[0]) .join(",") })`   

    const values = json
    .splice(+offset, +limit)
      .map(item => Object.values(item))
      .map(item  => {
        const col = `(${item.map(value => `'${value}'`).join(',')})`
        return col
      })
      .join(',')

    if(databaseUrl.includes('postgres')){
      const deleteQuery = `DELETE FROM ${table} WHERE nome IN ${uniques};`
      const insertQuery= `INSERT INTO ${table} ${fields} VALUES ${values};`    
     
      const client = new Client({ connectionString: databaseUrl})
      await client.connect()
      await client.query(deleteQuery)
      await client.query(insertQuery)
      await client.end()

      return `Fields added to the Database in the Table ${table}.`;
    } 
    
    throw new HttpException('Database not suported yet.', HttpStatus.NOT_ACCEPTABLE)
  }
}

