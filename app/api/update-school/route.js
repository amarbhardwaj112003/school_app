import pool from "../../../lib/db";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/schoolImages");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const uploadMiddleware = upload.none(); // Use none() since image is optional

  return new Promise((resolve) => {
    uploadMiddleware(req, null, async (err) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: "Upload error" }), { status: 500 }));
        return;
      }

      try {
        const formData = await req.formData();
        const id = formData.get("id");
        const name = formData.get("name");
        const address = formData.get("address");
        const city = formData.get("city");
        const state = formData.get("state");
        const contact = formData.get("contact");
        const email_id = formData.get("email_id");
        const imageFile = formData.get("image");

        if (!id || !name || !address || !city || !state || !contact || !email_id) {
          resolve(new Response(JSON.stringify({ error: "All fields except image are required" }), { status: 400 }));
          return;
        }

        let image = null;
        if (imageFile && imageFile instanceof File) {
          const buffer = await imageFile.arrayBuffer();
          const filename = Date.now() + path.extname(imageFile.name);
          const filepath = `public/schoolImages/${filename}`;
          fs.writeFileSync(filepath, Buffer.from(buffer));
          image = `/schoolImages/${filename}`;
        }

        const [result] = await pool.query(
          "UPDATE schools SET name = ?, address = ?, city = ?, state = ?, contact = ?, email_id = ?, image = ? WHERE id = ?",
          [name, address, city, state, contact, email_id, image || schools.find(s => s.id === parseInt(id)).image, id]
        );

        if (result.affectedRows === 0) {
          resolve(new Response(JSON.stringify({ error: "School not found" }), { status: 404 }));
        } else {
          resolve(new Response(JSON.stringify({ message: "School updated successfully" }), { status: 200 }));
        }
      } catch (error) {
        console.error("Error:", error);
        resolve(new Response(JSON.stringify({ error: "Server error" }), { status: 500 }));
      }
    });
  });
}