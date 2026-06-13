// =============================================
//  COMMUNITY MAKERS' MARKET — STORE (localStorage CRUD)
//  All data persisted client-side per PRD spec
// =============================================
'use strict';

var Store = (function() {

  // ── Keys ──────────────────────────────────
  var KEYS = {
    sellers:       'cmm-sellers',
    products:      'cmm-seller-products',
    inquiries:     'cmm-inquiries',
    currentSeller: 'cmm-current-seller',
    lang:          'cmm-lang',
    langChosen:    'cmm-lang-chosen',
  };

  // ── UUID ──────────────────────────────────
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // ── Generic helpers ───────────────────────
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch(e) { return null; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch(e) { console.error('Store.save error', e); }
  }

  // ── Language ──────────────────────────────
  function getLang()         { return load(KEYS.lang) || 'en'; }
  function setLang(lang)     { save(KEYS.lang, lang); }
  function isLangChosen()    { return !!load(KEYS.langChosen); }
  function markLangChosen()  { save(KEYS.langChosen, true); }

  // ── Sellers ───────────────────────────────
  function getSellers()          { return load(KEYS.sellers) || []; }
  function _saveSellers(list)    { save(KEYS.sellers, list); }

  function addSeller(data) {
    var sellers = getSellers();
    var seller = Object.assign({ id: uuid(), createdAt: new Date().toISOString() }, data);
    sellers.push(seller);
    _saveSellers(sellers);
    return seller;
  }

  function getSeller(id) {
    return getSellers().find(function(s){ return s.id === id; }) || null;
  }

  function updateSeller(id, data) {
    var sellers = getSellers();
    var idx = sellers.findIndex(function(s){ return s.id === id; });
    if (idx < 0) return null;
    sellers[idx] = Object.assign(sellers[idx], data, { updatedAt: new Date().toISOString() });
    _saveSellers(sellers);
    return sellers[idx];
  }

  // ── Current Seller Session ─────────────────
  function getCurrentSeller()      { return load(KEYS.currentSeller); }
  function setCurrentSeller(s)     { save(KEYS.currentSeller, s); }
  function clearCurrentSeller()    { localStorage.removeItem(KEYS.currentSeller); }

  // ── Seller Products ───────────────────────
  function getAllProducts()         { return load(KEYS.products) || []; }

  function getSellerProducts(sellerId) {
    return getAllProducts().filter(function(p){ return p.sellerId === sellerId; });
  }

  function addProduct(data) {
    var products = getAllProducts();
    var product = Object.assign({ id: uuid(), createdAt: new Date().toISOString() }, data);
    products.push(product);
    save(KEYS.products, products);
    return product;
  }

  function updateProduct(id, data) {
    var products = getAllProducts();
    var idx = products.findIndex(function(p){ return p.id === id; });
    if (idx < 0) return null;
    products[idx] = Object.assign(products[idx], data, { updatedAt: new Date().toISOString() });
    save(KEYS.products, products);
    return products[idx];
  }

  function deleteProduct(id) {
    var products = getAllProducts().filter(function(p){ return p.id !== id; });
    save(KEYS.products, products);
  }

  function getProduct(id) {
    return getAllProducts().find(function(p){ return p.id === id; }) || null;
  }

  // ── Inquiries ─────────────────────────────
  function getAllInquiries()        { return load(KEYS.inquiries) || []; }

  function getSellerInquiries(sellerId) {
    return getAllInquiries().filter(function(i){ return i.sellerId === sellerId; });
  }

  function addInquiry(data) {
    var inquiries = getAllInquiries();
    var inquiry = Object.assign({
      id: uuid(),
      createdAt: new Date().toISOString(),
      status: 'new',
      replies: [],
    }, data);
    inquiries.push(inquiry);
    save(KEYS.inquiries, inquiries);
    return inquiry;
  }

  function replyToInquiry(id, text, fromName) {
    var inquiries = getAllInquiries();
    var idx = inquiries.findIndex(function(i){ return i.id === id; });
    if (idx < 0) return null;
    if (!inquiries[idx].replies) inquiries[idx].replies = [];
    inquiries[idx].replies.push({
      text: text,
      fromSeller: true,
      fromName: fromName || 'Seller',
      createdAt: new Date().toISOString(),
    });
    inquiries[idx].status = 'replied';
    save(KEYS.inquiries, inquiries);
    return inquiries[idx];
  }

  function replyToInquiryAsBuyer(id, text, buyerName) {
    var inquiries = getAllInquiries();
    var idx = inquiries.findIndex(function(i){ return i.id === id; });
    if (idx < 0) return null;
    if (!inquiries[idx].replies) inquiries[idx].replies = [];
    inquiries[idx].replies.push({
      text: text,
      fromSeller: false,
      fromName: buyerName || 'Buyer',
      createdAt: new Date().toISOString(),
    });
    inquiries[idx].status = 'buyer-replied';
    save(KEYS.inquiries, inquiries);
    return inquiries[idx];
  }

  function getInquiriesByBuyer(email) {
    if (!email) return [];
    return getAllInquiries().filter(function(i){
      return (i.buyerEmail || i.email || '').toLowerCase() === email.toLowerCase();
    });
  }

  function markInquiryRead(id) {
    var inquiries = getAllInquiries();
    var idx = inquiries.findIndex(function(i){ return i.id === id; });
    if (idx < 0) return;
    if (inquiries[idx].status === 'new') inquiries[idx].status = 'read';
    save(KEYS.inquiries, inquiries);
  }

  return {
    uuid: uuid,
    // lang
    getLang: getLang, setLang: setLang,
    isLangChosen: isLangChosen, markLangChosen: markLangChosen,
    // sellers
    getSellers: getSellers, addSeller: addSeller,
    getSeller: getSeller, updateSeller: updateSeller,
    // session
    getCurrentSeller: getCurrentSeller,
    setCurrentSeller: setCurrentSeller,
    clearCurrentSeller: clearCurrentSeller,
    // products
    getAllProducts: getAllProducts,
    getSellerProducts: getSellerProducts,
    addProduct: addProduct, updateProduct: updateProduct,
    deleteProduct: deleteProduct, getProduct: getProduct,
    // inquiries
    getAllInquiries: getAllInquiries,
    getSellerInquiries: getSellerInquiries,
    addInquiry: addInquiry,
    replyToInquiry: replyToInquiry,
    replyToInquiryAsBuyer: replyToInquiryAsBuyer,
    getInquiriesByBuyer: getInquiriesByBuyer,
    markInquiryRead: markInquiryRead,
  };
})();
