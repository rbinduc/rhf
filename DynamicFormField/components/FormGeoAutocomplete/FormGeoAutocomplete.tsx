import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../../../store/root-reducer';
import FormAutocomplete, {IFormAutocompleteProps} from '../FormAutocomplete';
import CandidateBackendApi from '../../../../../../libs/candidate-backend-api';
import {tenantSlice} from '../../../../../../store/tenantSlice';

export type IFormGeoAutocompleteProps<T extends Record<string, any>> = IFormAutocompleteProps<T> & {
  geoLocation?: T;
  minAutoFillLength?: number;
  onKeyDownExtra?: (e: any) => void;
  onChangeExtra?: (e: any) => void;
};

export interface PlaceType {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      }
    ];
  };
}

const DEFAULT_LIMIT_TAGS = 1;

const {REACT_APP_GOOGLE_PLACES_CDN, REACT_APP_GOOGLE_MAPS_API_KEY, REACT_APP_GOOGLE_PLACES_SEARCH} = process.env;
const GOOGLE_AUTOCOMPLETE_API = `${REACT_APP_GOOGLE_PLACES_CDN}?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=${REACT_APP_GOOGLE_PLACES_SEARCH}`;

const autocompleteService = {current: null};

const throttle = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  const now = () => new Date().getTime();
  const resetStartTime = () => (startTime = now());
  let timeout: any;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout) {
        clearTimeout(timeout);
      }
      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(func(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(func(...args));
        }, timeLeft);
      }
    });
};

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const FormGeoAutocomplete = (props: IFormGeoAutocompleteProps<Record<string, any>>) => {
  const {
    geoLocation = {},
    noOptionsText = '',
    minAutoFillLength = 3,
    onKeyDownExtra = () => {},
    onChangeExtra = () => {},
    onInputChange = () => {},
  } = props ?? {};
  const {isMultiSelect = false, optionDisplayCount: limitTags = DEFAULT_LIMIT_TAGS} = geoLocation;
  const [value, setValue] = React.useState<string | string[] | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [placeId, setPlaceId] = React.useState('');
  const loaded = React.useRef(false);
  const dispatch = useDispatch();

  const {
    tenant: {tenantId, country, fetchCountryStatus},
  } = useSelector((state: RootState) => state) ?? ({} as RootState);

  useEffect(() => {
    if (!country && fetchCountryStatus !== 'pending') {
      CandidateBackendApi.fetchTenant(tenantId, {
        dispatch,
        setStatusAction: tenantSlice.actions.setStatus,
        setStatusName: 'fetchCountryStatus',
        dataUpdateAction: tenantSlice.actions.setCountry,
      });
    }
  }, [country]);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(GOOGLE_AUTOCOMPLETE_API, document.querySelector('head'), 'google-maps');
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      throttle((request: {input: string}, callback: (results?: PlaceType[]) => void) => {
        let userInput = request.input;

        const {types} = geoLocation ?? {};
        const countryCode = (country?.code || '').slice(0, 2);
        const payload: any = {
          input: userInput,
          types,
          componentRestrictions: {
            country: countryCode || undefined,
          },
        };

        (autocompleteService.current as any).getPlacePredictions(payload, callback);
      }, 200),
    [geoLocation, country]
  );

  const getPlaceById = () => {
    if ((window as any).google) {
      const service = new (window as any).google.maps.places.PlacesService(document.createElement('div'));

      if (placeId) {
        const request = {
          placeId,
        };

        service.getDetails(request, (place: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
            onChangeExtra(place?.address_components, place?.formatted_address);
          }
        });
      }
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue.length < minAutoFillLength) {
      setOptions(value ? (isMultiSelect ? (value as string[]) : [value as string]) : []);
      return undefined;
    }

    fetch({input: inputValue}, (results?: PlaceType[]) => {
      if (active) {
        let newOptions = [] as string[];
        const responseOptions =
          results?.map((item: any) => {
            const city = item.structured_formatting.main_text?.replace(/\s/g, '');
            const stateCountryRepresentation = item.structured_formatting.secondary_text;
            setPlaceId(item.place_id);
            return `${city}, ${stateCountryRepresentation}`;
          }) ?? [];

        if (value) {
          newOptions = isMultiSelect ? (value as string[]) : value ? [value as string] : [];
        }

        if (results) {
          newOptions = responseOptions;
        }

        newOptions = newOptions?.filter((item: any, index: any) => newOptions.indexOf(item) === index) || [];

        setOptions(newOptions ?? []);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, isMultiSelect]);

  return (
    <FormAutocomplete
      {...props}
      isMultiSelect={isMultiSelect}
      noOptionsText={!loading && !!inputValue ? noOptionsText : ''}
      loading={loading && inputValue.length >= minAutoFillLength && !value}
      options={options}
      value={isMultiSelect ? (value ? [value] : []) : value}
      limitTags={limitTags}
      onChangeExtra={(event: any, newValue: string | string[] | null) => {
        if (isMultiSelect) {
          setOptions(newValue ? [...(newValue as string[]), ...options] : options);
          setValue(newValue as string[]);
        } else {
          setOptions(newValue ? [newValue as string, ...options] : options);
          setValue(newValue as string);
        }
        getPlaceById();
      }}
      onInputChange={(event: any, newInputValue: string) => {
        setInputValue(newInputValue);
        onInputChange(event, newInputValue);
      }}
      onKeyDown={(e: any) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          onKeyDownExtra && onKeyDownExtra(e);
        }
      }}
    />
  );
};

export default FormGeoAutocomplete;
