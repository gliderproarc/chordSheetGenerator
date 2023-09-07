goog.provide('app.core');
app.core.enter = (function app$core$enter(){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Hello from ClojureScript!"], 0));
});
goog.exportSymbol('app.core.enter', app.core.enter);
app.core.recognizeText = (function app$core$recognizeText(){
return Promise.resolve(shadow.js.shim.module$tesseract.recognize("test.png","eng",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"logger","logger",-220675947),(function (p1__7272_SHARP_){
return console.log(p1__7272_SHARP_);
})], null)))).then((function (result){
return console.log(result.data.text);
}));
});
goog.exportSymbol('app.core.recognizeText', app.core.recognizeText);

//# sourceMappingURL=app.core.js.map
