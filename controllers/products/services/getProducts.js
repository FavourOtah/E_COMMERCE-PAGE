import productModel from "../../../models/productModel.js";
import mongoose from "mongoose";

export const getOneProduct = async (req, res) => {
    try {
        //ensuring a valid mongoose object id isproduced
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        };

        //getting the product
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Sorry, product not found. Most likely no longer on the shelf for sales."
            })
        };


        return res.status(200).json({
            message: "Products details",
            product
        })

    } catch (error) {
        console.error("Error fetching product", error)
        return res.status(500).json({ message: "Something went wrong. Please try again later." })
    }
};

export const getMany = async (req, res) => {
    try {
        //getting the parameters of the query
        const { category, price, minPrice, maxPrice, sort, limit, page } = req.query

        //building the filter object
        let filter = {}

        //filling up the filter with provided data using dot notation
        if (category) { filter.category = category };
        if (price) { filter.price = price };

        //when price range is used
        //in essence if a minimum or maximum price range is provided, the search/filter should be done in relation to the rpices provided
        //so if the customer minimum budget price is provided, all goods with prices eaual or higher to that price is returned
        //if maximum budget,goods higher, goods lower or equal to are provided.
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) { filter.price.$gte = Number(minPrice) };
            if (maxPrice) { filter.price.$lte = Number(maxPrice) };
        };

        //including a sorting option
        let sortOption = {};
        if (sort === "ascending") { sortOption.price = 1 }//this is at the long run saying, ".price" using the price role, sort the result in the order of(1), which is ascending order
        else if (sort === "descending") { sortOption.price = -1 }
        else if (sort === "newest") { sortOption.createdAt = -1 }//points to the createdAt row and sow in the (-1) order, newes to oldest.
        else {
            //creating default sorting option
            sortOption.createdAt = -1;
        }
        //including a pagination logic//we use a ternary operator//either are default values are used or the values provided by the clients.
        const itemsPerPage = limit ? parseInt(limit) : 10;//items per page is default to 10, except the client provides a different value
        const displayingPage = page ? parseInt(page) : 1;//page selected bythe client or our default page 1.
        const itemsSkipped = (displayingPage - 1) * itemsPerPage//we skip the items that would have displayed inthe preceding page and just start displaying items in the current page. the maths is current page - one would give us how
        //many page has been passed then we multiply it with the number of items per page.


        //fetching the products
        const products = await productModel.find(filter).sort(sortOption).skip(itemsSkipped).limit(itemsPerPage).lean()

        //getting total number of results for the query based on the filter
        const numberOfProducts = await productModel.countDocuments(filter)

        const totalPages = Math.ceil(numberOfProducts / itemsPerPage)

        return res.status(200).json({
            message: "Products retrieved successfully",
            total: numberOfProducts,
            items: products,
            paginationInfo: `Page ${displayingPage} of ${totalPages}.`
        });

    } catch (error) {
        console.error("Ërror fetching products", error)
        return res.status(500).json({
            message: "Something went wrong, please try again later."
        })

    }
}