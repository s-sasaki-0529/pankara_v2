FactoryBot.define do
  factory :history do
    user_event   { FactoryBot.create(:user_event) }
    song         { FactoryBot.create(:song) }
    score        { Random.rand(0..100) }
    satisfaction { Random.rand(1..10) }
    key          { Random.rand(-7..7) }
    comment      { SecureRandom.hex(20) }
    score_type { Random.rand(1..5) }
  end
end
