import Product from "../../models/product";
import * as FileSystem from 'expo-file-system';
/* import * as firebase from 'firebase/app';
import 'firebase/storage'; */

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

/* uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
        };
        
        xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        
        xhr.send(null);
    });
    }

    uploadToFirebase = (blob, title) => {
        return new Promise((resolve, reject)=>{
          var storageRef = firebase.storage().ref();
          storageRef.child(`images/${title}`).put(blob, {
            contentType: 'image/jpeg'
          }).then((snapshot)=>{
            blob.close();
            resolve(snapshot);
          }).catch((error)=>{
            reject(error);
          });
        });
      } */

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        // any async code you want!
        const userId = getState().auth.userId;
        try {
        const response = await fetch('https://shop-9368a.firebaseio.com/products.json')
        
        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response.json();
        const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(new Product(
                    key, 
                    resData[key].available,
                    resData[key].categoryId, 
                    resData[key].title, 
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                    )
                );

            }

        dispatch({
            type: SET_PRODUCTS, 
            products: loadedProducts.filter(product => product.available === true),
            allProducts: loadedProducts
        })
        } catch (err) {
            // send to analytics
            throw err;
        }
    }
}

export const toggleProduct = (productId, availableId) => {
    return async(dispatch, getState) => {
        console.log('toggle fired')
        const token = getState().auth.token;
        const response = await fetch(`https://shop-9368a.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                available: availableId
            })
        })

        if (!response.ok) {
            throw new Error('Something Went Wrong!')
        }

       fetchProducts()
    }
}

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://shop-9368a.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        }
    )

    if (!response.ok) {
        throw new Error('Something Went Wrong!')
    }

       dispatch({
        type: DELETE_PRODUCT, 
        pid: productId
       }) 
    }
}

export const createProduct = (categoryId, title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        /* const fileName = imageUrl.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;

        try {
            await FileSystem.moveAsync({
                from: imageUrl,
                to: newPath
            });
        } catch (err) {
            console.log(err);
            throw err;
        } */

        /* const blob = await uriToBlob(imageUrl)
        console.log(blob)
        const newPathResponse = await uploadToFirebase(blob, title) */

                     
        

        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://shop-9368a.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId,
                title,
                description,
                imageUrl,
                price,
                available: true
            })
        })

        const resData = await response.json();

        dispatch({
            type:CREATE_PRODUCT, 
            productData: {
                id: resData.name,
                categoryId,
                title,
                description,
                imageUrl,
                price,
                available: true
            }
        }) 
    }  
}

export const updateProduct = (id, categoryId, title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        /* const fileName = imageUrl.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;

        try {
            await FileSystem.moveAsync({
                from: imageUrl,
                to: newPath
            });
        } catch (err) {
            console.log(err);
            throw err;
        } */

        const token = getState().auth.token;
        const response = await fetch(`https://shop-9368a.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId,
                title,
                description,
                imageUrl,
                price
            })
        })

        if (!response.ok) {
            throw new Error('Something Went Wrong!')
        }

        dispatch({
            type:UPDATE_PRODUCT, 
            pid: id, 
            productData: {
                categoryId,
                title,
                description,
                imageUrl,
                price
            }
        })
    }   
}