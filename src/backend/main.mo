import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      product1.title.compare(product2.title);
    };
  };

  public type Product = {
    id : Nat;
    title : Text;
    description : Text;
    price : Float;
    originalPrice : ?Float;
    imageUrl : Text;
    affiliateUrl : Text;
    category : Text;
    badge : ?Text;
    rating : Float;
    reviewCount : Nat;
    isFeatured : Bool;
    isTrending : Bool;
    isActive : Bool;
  };

  public type Category = {
    #laptops;
    #headphones;
    #smartHome;
    #kitchen;
    #fashion;
    #fitness;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextProductId = 1;

  let products = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Category mapping
  func categoryToText(category : Category) : Text {
    switch (category) {
      case (#laptops) { "Laptops" };
      case (#headphones) { "Headphones" };
      case (#smartHome) { "Smart Home" };
      case (#kitchen) { "Kitchen" };
      case (#fashion) { "Fashion" };
      case (#fitness) { "Fitness" };
    };
  };

  // Authorization check
  func checkAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Functions (Admin Only)
  public shared ({ caller }) func addProduct(title : Text, description : Text, price : Float, originalPrice : ?Float, imageUrl : Text, affiliateUrl : Text, category : Category, badge : ?Text, rating : Float, reviewCount : Nat, isFeatured : Bool, isTrending : Bool) : async () {
    checkAdmin(caller);

    let product : Product = {
      id = nextProductId;
      title;
      description;
      price;
      originalPrice;
      imageUrl;
      affiliateUrl;
      category = categoryToText(category);
      badge;
      rating;
      reviewCount;
      isFeatured;
      isTrending;
      isActive = true;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, title : Text, description : Text, price : Float, originalPrice : ?Float, imageUrl : Text, affiliateUrl : Text, category : Category, badge : ?Text, rating : Float, reviewCount : Nat, isFeatured : Bool, isTrending : Bool, isActive : Bool) : async () {
    checkAdmin(caller);

    let product : Product = {
      id;
      title;
      description;
      price;
      originalPrice;
      imageUrl;
      affiliateUrl;
      category = categoryToText(category);
      badge;
      rating;
      reviewCount;
      isFeatured;
      isTrending;
      isActive;
    };

    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    checkAdmin(caller);
    products.remove(id);
  };

  // Public Query Functions (No authorization needed - public affiliate site)
  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getFeaturedProducts() : async [Product] {
    products.values().filter(func(product) { product.isFeatured }).toArray();
  };

  public query func getTrendingProducts() : async [Product] {
    products.values().filter(func(product) { product.isTrending }).toArray();
  };

  public query func getProductsByCategory(_category : Category) : async [Product] {
    let categoryString = categoryToText(_category);
    products.values().filter(func(product) { product.category == categoryString }).toArray();
  };

  public query func searchProducts(keyword : Text) : async [Product] {
    let lowerKeyword = keyword.toLower();
    products.values().filter(func(product) { product.title.toLower().contains(#text lowerKeyword) or product.description.toLower().contains(#text lowerKeyword) }).toArray();
  };

  public query func productExists(id : Nat) : async Bool {
    products.containsKey(id);
  };

  // Seed data (Admin only)
  public shared ({ caller }) func seedData() : async () {
    checkAdmin(caller);

    products.clear();
    nextProductId := 1;

    await addProduct("Dell XPS 13 Laptop", "High-performance laptop with 13-inch display", 999.99, ?1299.99, "https://example.com/images/xps13.jpg", "https://www.amazon.com/dp/B07R7Q3ZB8?tag=affiliate-20", #laptops, ?("Hot Deal"), 4.5, 120, true, true);

    await addProduct("Bose QuietComfort Headphones", "Noise-cancelling over-ear headphones", 299.99, null, "https://example.com/images/bose.jpg", "https://www.amazon.com/dp/B0863TXGM3?tag=affiliate-20", #headphones, ?("Best Seller"), 4.8, 250, false, true);

    await addProduct("Smart Home Hub", "Control your smart devices from one place", 129.99, ?149.99, "https://example.com/images/hub.jpg", "https://www.amazon.com/dp/B07PGL2ZSL?tag=affiliate-20", #smartHome, null, 4.3, 80, false, false);

    await addProduct("Kitchen Blender", "Powerful blender for smoothies and sauces", 59.99, ?79.99, "https://example.com/images/blender.jpg", "https://www.amazon.com/dp/B07VH89KFK?tag=affiliate-20", #kitchen, ?("Save 25%"), 4.2, 60, true, false);

    await addProduct("Men's Running Shoes", "Lightweight and comfortable running shoes", 69.99, null, "https://example.com/images/shoes.jpg", "https://www.amazon.com/dp/B09F8PQ7FZ?tag=affiliate-20", #fashion, null, 4.6, 110, false, false);

    await addProduct("Carpet Cleaner", "Professional carpet cleaning machine", 299.99, ?349.99, "https://example.com/images/cleaner.jpg", "https://www.amazon.com/dp/B07Y7Q6R68?tag=affiliate-20", #kitchen, ?("Save 15%"), 4.7, 50, false, true);
  };
};
