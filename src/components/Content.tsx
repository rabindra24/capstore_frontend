import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'


const Content = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        try {
            async function getData() {
                // await fetch('https://dummyjson.com/products')
                //     .then(res => res.json())
                //     .then((res) => setData(res.products));

                await axios.get("https://dummyjson.com/products").then(response => {
                    setData(response.data.products)
                })
            }
            getData();
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <div>
            {
                data ? (data.map((item) => (
                    <div key={item.id}>
                        <h2>{item.title}</h2>
                    </div>
                )))
                    : (<h1>loading</h1>)
            }
        </div>
    )
}

export default Content