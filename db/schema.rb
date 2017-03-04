# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170304172632) do

  create_table "compositions", force: :cascade do |t|
    t.string   "name"
    t.text     "notes"
    t.integer  "map_id",     null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["map_id"], name: "index_compositions_on_map_id"
  end

  create_table "heroes", force: :cascade do |t|
    t.string   "name",       null: false
    t.string   "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "maps", force: :cascade do |t|
    t.string   "name",       null: false
    t.string   "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "player_heroes", force: :cascade do |t|
    t.integer  "player_id",              null: false
    t.integer  "hero_id",                null: false
    t.integer  "confidence", default: 0, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["hero_id"], name: "index_player_heroes_on_hero_id"
    t.index ["player_id"], name: "index_player_heroes_on_player_id"
  end

  create_table "player_selections", force: :cascade do |t|
    t.integer  "player_hero_id", null: false
    t.string   "role"
    t.integer  "composition_id", null: false
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["composition_id"], name: "index_player_selections_on_composition_id"
    t.index ["player_hero_id"], name: "index_player_selections_on_player_hero_id"
  end

  create_table "players", force: :cascade do |t|
    t.string   "name",       null: false
    t.string   "battlenet"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_players_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end