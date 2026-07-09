import bcrypt from 'bcrypt';
import crypto from 'crypto';
(async ()=>{
  const uuid = crypto.randomUUID();
  const hash = await bcrypt.hash('admin1234', 10);
  console.log(uuid);
  console.log(hash);
})();
