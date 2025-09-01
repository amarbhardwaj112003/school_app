import multer from 'multer';
import path from 'path';
import pool from '../../../lib/db';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/schoolImages');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    if (!file) {
      return new Response(JSON.stringify({ error: 'No image uploaded' }), { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = Date.now() + path.extname(file.name);
    const filepath = `public/schoolImages/${filename}`;
    require('fs').writeFileSync(filepath, Buffer.from(buffer));

    const name = formData.get('name');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const contact = formData.get('contact');
    const email_id = formData.get('email_id');
    const image = `/schoolImages/${filename}`;

    if (!name || !address || !city || !state || !contact || !email_id) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, image, email_id]
    );

    return new Response(JSON.stringify({ message: 'School added successfully', id: result.insertId }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}