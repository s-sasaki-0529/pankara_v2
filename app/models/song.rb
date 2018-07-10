class Song < ApplicationRecord
  belongs_to :artist

  #
  # ArtistIDで絞り込み
  #
  def self.artist_by(artist_id)
    return self.all if artist_id.blank?
    self.where(artist_id: artist_id)
  end

  #
  # キーワードで絞り込み
  #
  def self.name_by(keyword)
    return self.all if keyword.blank?
    self.where("name like '%#{keyword}%'")
  end

  #
  # 歌唱履歴一覧
  #
  def histories
    History.where(song: self)
  end

  #
  # 特定ユーザの歌唱履歴一覧
  #
  def histories_by(user: nil)
    return [] if user.blank?
    History.joins(:user_event)
           .where(song: self, user_events: { user: user })
  end

  #
  # 歌唱回数
  # NOTE: これもカウンターキャッシュあっても良いかも？
  #
  def histories_count
    self.histories.size
  end

  #
  # 特定ユーザの歌唱回数
  # NOTE: これもどうにかキャッシュしたい
  #
  def histories_count_by(user: nil)
    self.histories_by(user: user).size
  end

  #
  # 持ち歌にしているユーザ一覧
  #
  def users
    user_ids = self.histories.joins(:user_event).pluck(:user_id).uniq
    User.where(id: user_ids)
  end

  #
  # ユーザIDごとの歌唱回数
  # return {1=>3, 3=>1, 5=>1}
  #
  def history_count_each_users
    self.histories.joins(:user_event).group(:user_id).count
  end

end
