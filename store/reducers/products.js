import PRODUCTS from '../../data/dummy-data';
import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    allProducts: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                allProducts: action.allProducts
            }
        case CREATE_PRODUCT: 
            const newProduct = new Product(
                action.productData.id, 
                action.productData.available,
                action.productData.categoryId, 
                action.productData.title, 
                action.productData.imageUrl, 
                action.productData.description, 
                action.productData.price);
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                allProducts: state.allProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const productIndex = state.allProducts.findIndex(
                prod => prod.id === action.pid); 
            const updatedProduct = new Product(
                action.pid, 
                state.allProducts[productIndex].available,
                action.productData.categoryId, 
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price);
            const updatedAllProducts = [...state.allProducts];
            updatedAllProducts[productIndex] = updatedProduct;
            const availableProductIndex = state.availableProducts.findIndex(
                prod => prod.id === action.pid); 
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                allProducts: updatedAllProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                allProducts: state.allProducts.filter(
                    product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.pid)
            }
    }
    return state;
}