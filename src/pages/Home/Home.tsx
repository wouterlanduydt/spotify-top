import React, { Component } from 'react';
import queryString from 'query-string';
import { Button, Poster, Select, Footer, Overlay, ConcertList } from '../../components';
import { ETimeRange, timeRanges } from 'types/general';
import { connect } from 'react-redux';
import { spotifyActions } from 'redux/actions';
import { IState } from 'redux/reducers';
import { spotifyApi } from 'api/spotify.api';
import idx from 'idx';
import { Filters, Actions } from './Home.styled';

type TProps = {
  getUserDetailsStart: () => void;
  createPlaylistStart: (artists: SpotifyApi.ArtistObjectFull[]) => void;
  getTopArtistsStart: (timeRange: ETimeRange) => void;
  user: IState['user'];
  artists: IState['artists'];
  createPlaylistState: IState['createPlaylist'];
};

type TState = {
  timeRange: ETimeRange;
};

class Home extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      timeRange: ETimeRange.medium,
    };
  }

  componentDidMount = () => {
    const { getUserDetailsStart, getTopArtistsStart } = this.props;

    const parsedUrl = queryString.parse(window.location.hash);
    spotifyApi.setAccessToken(String(parsedUrl.access_token));

    if (!!parsedUrl.access_token) {
      getUserDetailsStart();
      getTopArtistsStart(this.state.timeRange);
    }
  };

  onChangeTimeRange = (timeRange: string) => {
    const { artists, getTopArtistsStart } = this.props;

    if (artists[timeRange as ETimeRange].value.length === 0)
      getTopArtistsStart(timeRange as ETimeRange);
    this.setState({ timeRange: timeRange as ETimeRange });
  };

  render() {
    const { timeRange } = this.state;
    const { user, artists, createPlaylistStart, createPlaylistState } = this.props;

    return (
      <>
        <Filters>
          <Select
            label="Time Range"
            items={timeRanges}
            onChange={this.onChangeTimeRange}
            initialIndex={1}
          />
        </Filters>

        <Poster
          username={idx(user, _ => _.value.display_name)}
          artists={artists[timeRange]}
          timeRange={timeRange}
        />
        {createPlaylistState.isLoading && <Overlay text="Creating Playlist..." />}

        <Actions>
          <Button
            onClick={() =>
              !!artists[timeRange].value && createPlaylistStart(artists[timeRange].value!)
            }
            disabled={!artists[timeRange].value}
            title="Create a playlist containing recommendations based on your top artists."
          >
            Generate Playlist
          </Button>
          <Button onClick={() => window.alert('Coming soon')}>Save as image</Button>
          <Button to="/concerts">See Concerts</Button>
        </Actions>
        <Footer />
      </>
    );
  }
}

export default connect(
  ({ user, artists, createPlaylist: createPlaylistState }: IState) => ({
    user,
    artists,
    createPlaylistState,
  }),
  {
    getUserDetailsStart: spotifyActions.getUserDetailsStart,
    getTopArtistsStart: spotifyActions.getTopArtistsStart,
    createPlaylistStart: spotifyActions.createPlaylistStart,
  },
)(Home);