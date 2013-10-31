class CreateBucketItems < ActiveRecord::Migration
  def change
    create_table :bucket_items do |t|
      t.string :title
      t.string :description
      t.boolean :completed

      t.timestamps
    end
  end
end
