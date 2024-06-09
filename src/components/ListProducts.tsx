import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  product_name: string;
  images: string;
  price: number;
  quantity: number;
  created_at: string;
}

export default function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [typeSubmit, setTypeSubmit] = useState<string>("add");
  const [product, setProduct] = useState<Product>({
    id: Math.ceil(Math.random() * 1000000),
    product_name: "",
    images: "",
    price: 0,
    quantity: 0,
    created_at: new Date().toISOString(),
  });

  // Hàm lấy thông tin sản phẩm
  const getAllProduct = () => {
    fetch(`http://localhost:3000/products`)
      .then((response: Response) => response.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.log(error));
  };

  // Hàm lấy thông tin sản phẩm theo id
  const getProductById = (id: number) => {
    fetch(`http://localhost:3000/products/${id}`, {
      method: "GET",
    })
      .then((response: Response) => {
        if (response.status === 404) {
          console.log("Không tìm thấy bản ghi");
          return null;
        }
        return response.json();
      })
      .then((product: Product | null) => {
        if (product) {
          console.log(product);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  useEffect(() => {
    if (inputValue) {
      getProductById(Number(inputValue));
    }
  }, [inputValue]);

  // Hàm xóa sản phẩm
  const removeProductById = (id: number) => {
    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    })
      .then((response: Response) => {
        if (response.ok) {
          getAllProduct();
          console.log("đã xóa");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeSubmit === "add") {
      createProduct();
    } else {
      updateProductById(product.id);
    }
  };

  // Hàm thêm sản phẩm
  const createProduct = () => {
    fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        console.log(data);
        getAllProduct();
        resetForm();
      })
      .catch((error) => console.log(error));
  };

  // Hàm cập nhật sản phẩm
  const updateProductById = (id: number) => {
    fetch(`http://localhost:3000/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        console.log(data);
        getAllProduct();
        resetForm();
      })
      .catch((error) => console.log(error));
  };

  const handleEditClick = (id: number) => {
    setTypeSubmit("update");
    fetch(`http://localhost:3000/products/${id}`)
      .then((response: Response) => response.json())
      .then((data: Product) => setProduct(data))
      .catch((error) => console.log(error));
  };

  const resetForm = () => {
    setProduct({
      id: Math.ceil(Math.random() * 1000000),
      product_name: "",
      images: "",
      price: 0,
      quantity: 0,
      created_at: new Date().toISOString(),
    });
    setTypeSubmit("add");
  };

  return (
    <>
      <div className="container">
        <div>
          <input
            className="w-25"
            type="text"
            placeholder="Nhập ID sản phẩm cần tìm"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <form
          action=""
          className="d-flex flex-column my-3"
          onSubmit={handleSubmit}
        >
          <h1>
            {typeSubmit === "add" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
          </h1>
          <label htmlFor="">Tên sản phẩm</label>
          <input
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
            type="text"
          />
          <label htmlFor="">Ảnh</label>
          <input
            name="images"
            value={product.images}
            onChange={handleChange}
            type="text"
          />
          <label htmlFor="">Giá tiền</label>
          <input
            name="price"
            value={product.price}
            onChange={handleChange}
            type="number"
          />
          <label htmlFor="">Số lượng</label>
          <input
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            type="number"
          />
          <button type="submit">
            {typeSubmit === "add" ? "Thêm" : "Cập nhật"}
          </button>
          {typeSubmit === "update" && (
            <button type="button" onClick={resetForm}>
              Hủy
            </button>
          )}
        </form>
        <table className="table table-hover table-bordered text-center">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Ảnh</th>
              <th scope="col">Giá tiền</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Ngày thêm</th>
              <th scope="col">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.product_name}</td>
                <td>{product.images}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.created_at}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEditClick(product.id)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeProductById(product.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
