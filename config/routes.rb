BucketListApp::Application.routes.draw do
  root to: "bucket_items#index"

  resources :bucket_items
end
