export interface CityInterface {
  coordinates: {
    latitude: number;
    longitude: number;
  }
}

export type CityEnum = Record<string, CityInterface>;

export const Cities: CityEnum = {
  Paris: {
    coordinates: {
      latitude: 48.85661,
      longitude: 2.351499
    }
  },
  Cologne: {
    coordinates: {
      latitude: 50.938361,
      longitude: 6.959974
    }
  },
  Brussels: {
    coordinates: {
      latitude: 50.846557,
      longitude: 4.351697
    }
  },
  Amsterdam: {
    coordinates: {
      latitude: 52.370216,
      longitude: 4.895168
    }
  },
  Hamburg: {
    coordinates: {
      latitude: 53.550341,
      longitude: 10.000654
    }
  },
  Dusseldorf: {
    coordinates: {
      latitude: 51.225402,
      longitude: 6.776314
    }
  }
};
