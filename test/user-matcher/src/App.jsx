import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";

const interestsList = [
  "Cooking", "Reading", "Gaming", "Traveling", "Music", "Fitness",
  "Movies", "Art", "Technology", "Sports"
];

export default function Matcher() {
  const [form, setForm] = useState({});
  const [options, setOptions] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/options")
      .then((res) => res.json())
      .then((data) => setOptions(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Find Your Best Match</h1>
      {Object.keys(options).map((cat) => (
        <div key={cat}>
          <Label>{cat}</Label>
          <Select name={cat} onValueChange={(val) => handleSelectChange(cat, val)}>
            {options[cat].map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </Select>
        </div>
      ))}
      <div>
        <Label>Age</Label>
        <Input type="number" name="Age" onChange={handleChange} />
      </div>
      <div>
        <Label>Interests (comma-separated)</Label>
        <Textarea name="Interests" onChange={handleChange} />
      </div>
      <Button onClick={handleSubmit}>Find Match</Button>

      {result && (
        <Card className="mt-4">
          <CardContent className="space-y-2">
            <h2 className="text-xl font-semibold">Best Match:</h2>
            {Object.entries(result).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
