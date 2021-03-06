class PlayerHero < ApplicationRecord
  belongs_to :player
  belongs_to :hero

  validates :player, :hero, presence: true
  validates :confidence, numericality: { only_integer: true }
  validates :player_id, uniqueness: { scope: :hero_id }
end
