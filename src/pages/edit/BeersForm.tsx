import React from 'react';

type Field = { key: string; value: string };
type UniqueField = { id: string; key: string; value: string };
type Beer = { name: string; fields: UniqueField[] };

export interface Props {
  beers?: Array<{ name?: string; fields?: Field[] }>;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const BeersForm: React.FC<Props> = ({ beers }) => {
    const [beerData, setBeerData] = React.useState<Beer[]>(
        () => beers.map((b) => ({
            name: b.name ?? "",
            fields: (b.fields ?? []).map((field) => ({
                id: uid(),
                ...field,
            })),
        }))
    );

    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalText, setModalText] = React.useState("");
    const [updatingData, setUpdatingData] = React.useState(false);

    const setBeer = (index: number, updater: (b: Beer) => Beer) =>
        setBeerData((prev) => {
            const copy = [...prev];
            copy[index] = updater(copy[index]);
            return copy;
        });

    const onNameChange = (index: number, value: string) => setBeer(index, (b) => ({ ...b, name: value }));

    const onFieldKeyChange = (beerIndex: number, fieldId: string, newKey: string) =>
        setBeer(beerIndex, (b) => ({
            ...b,
            fields: b.fields.map((f) => (f.id === fieldId ? { ...f, key: newKey } : f)),
        }));

    const onFieldChange = (beerIndex: number, fieldId: string, value: string) =>
        setBeer(beerIndex, (b) => ({
            ...b,
            fields: b.fields.map((f) => (f.id === fieldId ? { ...f, value } : f)),
        }));

    const onRemoveField = (beerIndex: number, fieldId: string) =>
        setBeer(beerIndex, (b) => ({
            ...b,
            fields: b.fields.filter((f) => f.id !== fieldId),
        }));

    const onAddField = (beerIndex: number) =>
        setBeer(beerIndex, (b) => ({
            ...b,
            fields: [...b.fields, { id: uid(), key: "", value: "" }],
        }));

    const onAddBeer = () => {
        setBeerData((prev) => [...prev, { name: "", fields: [] }]);
    }

    const onRemoveBeer = (beerIndex: number) => {
        setBeerData((prev) => prev.filter((_, i) => i !== beerIndex));
    }

    const onSave = async () => {
        const payload = beerData.map((b) => ({
            name: b.name,
            fields: b.fields.map((f) => ({ key: f.key, value: f.value })),
        }));

        setUpdatingData(true);
        await fetch('/api/beers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setUpdatingData(false)
        setModalText("Data saved!");
        setModalVisible(true);
    };
    return (
        <div className="flex flex-col items-end justify-center gap-16 w-full md:w-160">
            <div className={`fixed inset-0 backdrop-blur-xs bg-black/70 flex items-center justify-center ${modalVisible ? '' : 'hidden'}`}>
                <div className="bg-white p-8 rounded shadow-md flex flex-col items-start justify-center gap-8">
                    <p>{modalText}</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setModalVisible(false)}
                    >
                        Close
                    </button>
                </div>
            </div>


            { beerData.map((beer, index) => (
                <div key={index} className="bg-[#ffffff] text-[#152128] flex flex-col justify-start p-8 w-full items-end gap-8">
                    <div key={index} className="flex flex-col items-start justify-center gap-2 w-full">
                        <div>Name:</div>
                        <div>
                            <input
                                type="text"
                                value={beer.name}
                                onChange={(e) => {
                                    onNameChange(index, e.target.value)
                                }}
                                className="border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>Fields:</div>
                        <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_2fr_1fr] gap-2">
                            { beer.fields.map(((field, fieldIdx) => (
                                <React.Fragment key={field.id}>
                                    <hr className={`col-span-3 w-full border-t border-gray-300 my-2 ${fieldIdx == 0 ? "hidden" : "md:hidden"}`} />
                                    <input
                                        type="text"
                                        value={field.key}
                                        onChange={(e) => onFieldKeyChange(index, field.id, e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={field.value}
                                        onChange={(e) => onFieldChange(index, field.id, e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                        required
                                    />
                                    <button
                                        className="bg-[#829797] text-[#ffffff] px-4 py-2"
                                        onClick={async () => onRemoveField(index, field.id)}
                                    >Remove</button>
                                </React.Fragment>
                            )))}
                        </div>

                        <button
                            className="mt-2 bg-[#829797] text-white px-4 py-2"
                            onClick={() => onAddField(index)}
                            type="button"
                        >
                            + Add field
                        </button>
                    </div>
                    <button
                        className="mt-2 bg-[#829797] px-4 py-2 bg-red-700 text-white"
                        onClick={() => onRemoveBeer(index)}
                        type="button"
                    >
                        Remove beer
                    </button>
                </div>
            ))}
            <div className="w-full flex items-center justify-between">
                <button
                    className="bg-[#829797] text-[#ffffff] px-4 py-2"
                    onClick={onAddBeer}
                >Add Beer</button>
                <button
                    className="bg-[#829797] text-[#ffffff] px-4 py-2"
                    onClick={onSave}
                >Save Beers</button>
            </div>
        </div>
    );
}
