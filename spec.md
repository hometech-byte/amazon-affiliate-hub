# Amazon Affiliate Hub

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Homepage with hero banner showcasing top deals
- Featured Deals section with product cards (4-column grid)
- Explore Categories section (6 category tiles)
- Top Trending Picks section (horizontal product cards)
- Product cards with affiliate links pointing to Amazon
- Search bar in header
- Navigation with category links
- Footer with Amazon Associates disclaimer, newsletter signup, and links
- Admin panel to manage products and affiliate links (CRUD)
- Sample product data with affiliate URLs, prices, ratings, badges

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store products (title, price, imageUrl, affiliateUrl, category, badge, rating, isTrending, isFeatured), categories
2. Backend: CRUD for products (admin use), getAll, getFeatured, getTrending, getByCategory queries
3. Frontend: Header with logo, nav, search, cart icon
4. Frontend: Hero banner with CTA
5. Frontend: Featured Deals 4-column product card grid
6. Frontend: Explore Categories 6-tile section
7. Frontend: Top Trending Picks horizontal card section
8. Frontend: Footer with disclaimer and links
9. Admin page behind authorization for managing products
