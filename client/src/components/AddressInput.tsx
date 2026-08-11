import { Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { AddressSuggestion, AddressValue } from '@/types/ride';
import { autocompleteAddress, getPlace } from '@/services/maps';

type AddressInputProps = {
  id: string;
  label: string;
  value: AddressValue;
  placeholder: string;
  error?: string;
  onChange: (value: AddressValue) => void;
};

export function AddressInput({ id, label, value, placeholder, error, onChange }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapsUnavailable, setMapsUnavailable] = useState(false);
  const [open, setOpen] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const input = value.address.trim();
    if (input.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const result = await autocompleteAddress(input);
        if (currentRequest !== requestId.current) return;
        setMapsUnavailable(!result.available);
        setSuggestions(result.suggestions);
        setOpen(result.suggestions.length > 0);
      } catch {
        if (currentRequest !== requestId.current) return;
        setMapsUnavailable(true);
        setSuggestions([]);
        setOpen(false);
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    }, 320);

    return () => window.clearTimeout(timer);
  }, [value.address]);

  async function selectSuggestion(suggestion: AddressSuggestion) {
    setOpen(false);
    setLoading(true);
    try {
      const result = await getPlace(suggestion.placeId);
      if (result.available && result.place) {
        onChange({
          address: result.place.address || suggestion.label,
          latitude: result.place.latitude,
          longitude: result.place.longitude
        });
        return;
      }
      onChange({ address: suggestion.label, latitude: null, longitude: null });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-pine/60" aria-hidden />
        <input
          id={id}
          className={`input pl-10 ${error ? 'input-error' : ''}`}
          value={value.address}
          placeholder={placeholder}
          onChange={(event) => onChange({ address: event.target.value, latitude: null, longitude: null })}
          onFocus={() => setOpen(suggestions.length > 0)}
          autoComplete="street-address"
        />
        {loading ? <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-pine" aria-hidden /> : null}
        {open ? (
          <div className="suggestion-panel" role="listbox">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.placeId}
                className="suggestion-item"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {mapsUnavailable ? (
        <p className="helper">Autocomplete indisponível agora. Você pode informar o endereço manualmente.</p>
      ) : null}
      {value.latitude && value.longitude ? <p className="helper">Coordenadas salvas para cálculo de rota.</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
}
