require 'rails_helper'

describe Player do
  before(:all) do
    @anon_user = User.anonymous || create(:anonymous_user)
  end

  it "requires a name" do
    player = Player.new
    expect(player.valid?).to be_falsey
    expect(player.errors[:name].any?).to be_truthy
  end

  it 'requires a unique name per authenticated creator' do
    user = create(:user)
    player1 = create(:player, creator: user)
    player2 = build(:player, creator: user, name: player1.name)
    expect(player2.valid?).to be_falsey
    expect(player2.errors[:name].any?).to be_truthy
  end

  it 'requires a unique name per anonymous creator' do
    player1 = create(:player, creator: @anon_user, creator_session_id: '123')
    player2 = build(:player, creator: @anon_user, name: player1.name,
                    creator_session_id: player1.creator_session_id)
    expect(player2.valid?).to be_falsey
    expect(player2.errors[:name].any?).to be_truthy
  end

  it 'requires a creator' do
    player = Player.new
    expect(player.valid?).to be_falsey
    expect(player.errors[:creator].any?).to be_truthy
  end

  it 'requires a creator session ID if the creator is anonymous' do
    player = Player.new(creator: @anon_user)
    expect(player.valid?).to be_falsey
    expect(player.errors[:creator_session_id].any?).to be_truthy
  end

  context '#find_if_allowed' do
    it 'returns nil when anonymous user does not own player' do
      player = create(:player)
      result = Player.find_if_allowed(player.id, user: nil, session_id: '123')
      expect(result).to be_nil
    end

    it 'returns nil when authenticated user does not own player' do
      player = create(:player)
      result = Player.find_if_allowed(player.id, user: create(:user), session_id: nil)
      expect(result).to be_nil
    end

    it 'returns player when tied to authenticated user' do
      current_user = create(:user)
      player = create(:player, user: current_user)
      result = Player.find_if_allowed(player.id, user: current_user, session_id: nil)
      expect(result).to eq(player)
    end

    it 'returns owned player for anonymous user' do
      player = create(:player, creator: @anon_user, creator_session_id: '123')
      result = Player.find_if_allowed(player.id, user: nil, session_id: '123')
      expect(result).to eq(player)
    end

    it 'returns owned player for authenticated user' do
      user = create(:user)
      player = create(:player, creator: user)
      result = Player.find_if_allowed(player.id, user: user, session_id: nil)
      expect(result).to eq(player)
    end
  end

  it 'decrements positions of subsequent players in comp on destroy' do
    user = create(:user)
    comp = create(:composition, user: user)

    player1 = create(:player, creator: user)
    player2 = create(:player, creator: user)
    player3 = create(:player, creator: user)

    comp_player1 = create(:composition_player, composition: comp,
                          position: 0, player: player1)
    comp_player2 = create(:composition_player, composition: comp,
                          position: 1, player: player2)
    comp_player3 = create(:composition_player, composition: comp,
                          position: 2, player: player3)

    expect { player2.destroy }.
      to change { CompositionPlayer.count }.by(-1)

    expect(comp_player1.reload.position).to eq(0)
    expect(comp_player3.reload.position).to eq(1)
  end
end
