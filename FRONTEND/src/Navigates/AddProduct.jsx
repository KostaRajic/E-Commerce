import { useState } from "react";

export const AddProduct = () => {
    const [form, setForm] = useState({
        name: '',
        price: '',
        rating: '',
        category: '',
        description: '',
        img: null
    })


    return (
        <div className="addProductPage">
            <h2>Add Product</h2>

            <form>

                <input
                    type="text"
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <input
                    type="number"
                    step="0.1"
                    placeholder="Rating (1–5)"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <label className="fileUpload">
                    <input
                        type="file"
                        onChange={(e) => setForm({ ...form, img: e.target.files[0] })}
                        style={{ background: 'transparent', border: 'none' }}
                    />
                    <span>Upload image</span>
                </label>

                <button type="submit" onClick={() => alert("Changes saved successfully (demo mode — no real data changed)")}>Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;