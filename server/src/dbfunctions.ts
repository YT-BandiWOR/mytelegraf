import { QueryResult } from 'pg';
import { promisify } from 'util';
import dbPool from "./dbpool";

type DbQueryFunction = <T = any>(sql: string, values?: any[]) => Promise<QueryResult<T>>;

const dbQuery: DbQueryFunction = promisify(dbPool.query).bind(dbPool);

export default dbQuery;