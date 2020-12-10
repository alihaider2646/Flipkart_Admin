import './style.css'
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import Input from '../../components/UI/Input';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct } from '../../actions';
import Modal from '../../components/UI/Modal';
import { generatePublicUrl } from '../../urlConfig'


const Products = (props) => {
    const { onSubmit } = props;
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [productPictures, setProductPictures] = useState([]);
    const [productDetailModal, setProductDetailModal] = useState(false);
    const [productDetails, setProductDetails] = useState(null);


    const category = useSelector(state => state.category);
    const product = useSelector(state => state.product);
    const dispatch = useDispatch();

    const handleClose = () => {
        const form = new FormData();
        form.append('name', name);
        form.append('quantity', quantity);
        form.append('price', price);
        form.append('description', description);
        form.append('category', categoryId);
        for (let pic of productPictures) {
            form.append('productPicture', pic);
        }
        dispatch(addProduct(form));
        setShow(false)
    };
    const handleShow = () => setShow(true);


    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({ value: category._id, name: category.name });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }
        return options;
    }

    const handleProductPictures = (e) => {
        setProductPictures([
            ...productPictures,
            e.target.files[0]
        ]);
    }
    // console.log(productPictures);

    const renderProducts = () => {
        return (
            <Table striped hover style={{ fontSize: 12 }} responsive="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        product.products.length > 0 ?
                            product.products.map(product =>
                                <tr style={{ cursor: "pointer" }} onClick={() => showProductDetailModal(product)} key={product._id}>
                                    <td>1</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.category.name}</td>
                                </tr>) : null
                    }

                </tbody>
            </Table>
        );
    }

    const renderAddProductModal = () => {
        return (
            <Modal
                show={show}
                handleClose={() => setShow(false)}
                // handleClose={handleClose}
                modalTitle={'Add New Product'}
                onSubmit={handleClose}
            >
                <Input
                    value={name}
                    placeholder={`Product Name`}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    value={quantity}
                    placeholder={`Quantity`}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                    value={price}
                    placeholder={`Price`}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                    value={description}
                    placeholder={`Product Description`}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select value={categoryId} className="form-control mt-4" style={{ cursor: "pointer" }} onChange={(e) => setCategoryId(e.target.value)} >
                    <option>Select Category</option>
                    {
                        createCategoryList(category.categories).map(option =>
                            <option key={option.value} value={option.value}>{option.name}</option>)
                    }
                </select>
                {
                    productPictures.length > 0 ? productPictures.map((pic, index) => <div key={index}>{pic.name}</div>) : null
                }
                <input type="file" name="productPicture" className="mt-4" onChange={handleProductPictures} />
            </Modal>
        );
    }

    const handleCloseProductDetailsModal = () => setProductDetailModal(false);

    const showProductDetailModal = (product) => {
        setProductDetails(product);
        setProductDetailModal(true);
    }

    const renderProductDetailsModal = () => {
        if (!productDetails) {
            return null;
        }
        return (
            <Modal
                show={productDetailModal}
                handleClose={handleCloseProductDetailsModal}
                modalTitle={'Product Details'}
                size="lg"
                onSubmit={handleCloseProductDetailsModal}
            >
                <Row>
                    <Col md="6">
                        <label className="key">Name</label>
                        <p className="value">{productDetails.name}</p>
                    </Col>
                    <Col md="6">
                        <label className="key">Price</label>
                        <p className="value">{productDetails.price}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <label className="key">Quantity</label>
                        <p className="value">{productDetails.quantity}</p>
                    </Col>
                    <Col md="6">
                        <label className="key">Category</label>
                        <p className="value">{productDetails.category.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <label className="key">Desciption</label>
                        <p className="value">{productDetails.description}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label className="key">Product Pictures</label>
                        <div style={{ display: 'flex' }}>
                            {productDetails.productPictures.map(picture =>
                                <div className="productImgContainer">
                                    <img src={generatePublicUrl(picture.img)} />
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Modal>
        )
    }
    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="mt-3" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h3>Products</h3>
                            <Button variant="primary" onClick={handleShow}>Add Product</Button>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        {renderProducts()}
                    </Col>
                </Row>
            </Container>
            {renderAddProductModal()}
            {renderProductDetailsModal()}
        </Layout>
    );
};

export default Products;