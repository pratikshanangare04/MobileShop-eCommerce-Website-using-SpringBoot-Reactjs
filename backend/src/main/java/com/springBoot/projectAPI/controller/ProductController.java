package com.springBoot.projectAPI.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.springBoot.projectAPI.dto.Product;
import com.springBoot.projectAPI.repository.ProductRepository;
import com.springBoot.projectAPI.service.ProductService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/products")
public class ProductController {

	private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

//    @PostMapping("/saveProduct")
//    public Product addProduct(@RequestBody Product product) {
//        return productService.addProduct(product);
//    }
    
    @PostMapping("/add")
	public Product addProducts(@RequestParam("name") String name, @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") int stock,
            @RequestParam("image") MultipartFile image,
            @RequestParam("discount") int discount,
            @RequestParam("discountPrice") Double discountPrice,
            @RequestParam("isActive") Boolean isActive) throws IOException {

		// Save the image file
		File directory = new File(UPLOAD_DIR);
		if (!directory.exists()) {
			directory.mkdir();
		}
		Path filePath = Paths.get(UPLOAD_DIR, image.getOriginalFilename());
		Files.write(filePath, image.getBytes());

		String fileName="/uploads/" + image.getOriginalFilename();
		// Save product with the image path
		Product product = new Product(name, description, price, stock, fileName, discount, discountPrice, isActive);
		return productService.addProduct(product);
	}

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully!";
    }
    

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("name") String name) {
        return productService.searchProductsByName(name);
    }
}

