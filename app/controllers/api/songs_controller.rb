class Api::SongsController < Api::BaseController
  before_action :song_exists?, only: %i[show histories]
  before_action :user_exists?, only: :histories

  #
  # 楽曲の一覧を取得
  #
  def index
    if params[:with_artist]
      render json: songs.map { |song| JSON::Song.index_with_artist(song) }
    else
      render json: songs.map { |song| JSON::Song.raw(song) }
    end
  end

  #
  # 楽曲の詳細を取得
  #
  def show
    render json: JSON::Song.show(song, @current_user)
  end

  #
  # 楽曲の歌唱履歴一覧を取得
  #
  def histories
    render json: song_histories.map { |history| JSON::History.raw(history) }
  end

  private

    #
    # 一覧取得対象の楽曲一覧
    #
    def songs
      @index = Song
               .artist_by(params[:artist_id])
               .name_by(params[:name])
               .order(params[:sort_key] => params[:sort_order])
               .page(params[:page])
               .per(params[:per])
               .includes(:artist)
    end

    #
    # 詳細取得対象の楽曲
    #
    def song
      @song ||= Song.find_by(id: params[:id])
    end

    #
    # 対象楽曲の歌唱履歴一覧
    # TODO: N + 1の修正
    # TODO: ABCSize
    #
    def song_histories
      histories = if params[:user_id].present?
                    song.histories_by(user: User.find(params[:user_id]))
                  else
                    song.histories
                  end
      @index = histories
               .order(params[:sort_key] => params[:sort_order])
               .page(params[:page])
               .per(params[:per])
    end

    #
    # 詳細取得対象の楽曲が存在するか?
    # TODO: 例外処理の汎用化
    #
    def song_exists?
      raise404 if song.blank?
    end

    #
    # 歌唱履歴一覧取得対象のユーザが存在するか?
    # TODO: 例外処理の汎用化
    #
    def user_exists?
      return true if params[:user_id].blank?
      return true if User.exists?(params[:user_id])
      raise404 'user_not_found'
    end
end