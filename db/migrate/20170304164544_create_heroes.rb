class CreateHeroes < ActiveRecord::Migration[5.0]
  def change
    create_table :heroes do |t|
      t.string :name, null: false
      t.string :role
      t.timestamps
    end
  end
end
