import {PGlite} from '@electric-sql/pglite'
import {readFileSync} from 'node:fs'
import assert from 'node:assert/strict'
const db = new PGlite()
await db.exec(`create role anon; create role authenticated; create schema auth;
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
grant usage on schema auth to anon, authenticated; grant execute on function auth.jwt() to anon, authenticated;`)
const schema=readFileSync(new URL('../supabase/schema.sql', import.meta.url),'utf8')
const seed=readFileSync(new URL('../supabase/seed.sql', import.meta.url),'utf8')
await db.exec(schema); await db.exec(seed); await db.exec(schema); await db.exec(seed)
assert.equal((await db.query('select count(*)::int as n from words')).rows[0].n,100)
for (const role of ['anon','authenticated']) {
  await db.exec(`set role ${role}; set request.jwt.claims = '{"user_metadata":{"role":"word_admin"}}';`)
  assert.equal((await db.query('select count(*)::int as n from words')).rows[0].n,100)
  await assert.rejects(db.query("insert into words(word,ipa,meaning,category) values ('test','test','測試','測試')"))
  for (const sql of ["update words set meaning='changed' where word='apple' returning id", "delete from words where word='apple' returning id"]) {
    if (role === 'anon') await assert.rejects(db.query(sql), { code: '42501' })
    else assert.equal((await db.query(sql)).rows.length, 0)
  }
  await db.exec('reset role')
}
await db.exec(`set role authenticated; set request.jwt.claims = '{"app_metadata":{"role":"word_admin"}}';`)
assert.equal((await db.query("insert into words(word,ipa,meaning,category) values ('test','test','測試','測試') returning id")).rows.length,1)
assert.equal((await db.query("update words set meaning='測試修改' where word='apple' returning id")).rows.length,1)
assert.equal((await db.query("delete from words where word='test' returning id")).rows.length,1)
await db.exec('reset role');await db.exec(seed)
assert.equal((await db.query("select meaning from words where word='apple'")).rows[0].meaning,'測試修改')
await db.close()
console.log('PASS: local PostgreSQL schema/seed repeatability; anonymous and ordinary users denied writes, user_metadata cannot grant admin, admin claim permits writes, re-seeding preserves edits. Remote project not tested.')
