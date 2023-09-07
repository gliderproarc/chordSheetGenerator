(ns app.core
  (:require ["tesseract.js" :as tesseract]))

(defn ^:export enter []
  (println "Hello from ClojureScript!"))


(defn ^:export recognizeText []
  (-> (js/Promise.resolve
       (tesseract/recognize "test.png" "eng" (clj->js {:logger #(js/console.log %)})))
      (.then (fn [result]
               (js/console.log (.-text (.-data result)))))))
