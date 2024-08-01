import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const MAX_POINTS = 2254;
const MAX_ASSISTS = 589;
const MAX_OFFENSIVE_REBOUNDS = 196;
const MAX_DEFENSIVE_REBOUNDS = 645;
const MAX_FIELD_PERCENT = 1;
const MAX_FREE_THROW_PERCENT = 1;
const MAX_STEALS = 150;
const MAX_BLOCKS = 81;
const MAX_PERSONAL_FOULS = 250;

const NBAPlayerCard = ({ player }) => {

  const pointsPerGame = player.points / player.games;
  const assistsPerGame = player.assists / player.games;
  const offensiveReboundsPerGame = player.offensiveRb / player.games;
  const fieldGoalPercentage = player.fieldPercent;
  const freeThrowPercentage = player.ftPercent || 0; 
  const stealsPerGame = player.steals / player.games;
  const blocksPerGame = player.blocks / player.games;
  const defensiveReboundsPerGame = player.defensiveRb / player.games;
  const personalFoulsPerGame = player.personalFouls / player.games;


  const normalizedPoints = pointsPerGame / (MAX_POINTS / player.games);
  const normalizedAssists = assistsPerGame / (MAX_ASSISTS / player.games);
  const normalizedOffensiveRebounds = offensiveReboundsPerGame / (MAX_OFFENSIVE_REBOUNDS / player.games);
  const normalizedFieldGoalPercentage = fieldGoalPercentage / MAX_FIELD_PERCENT;
  const normalizedFreeThrowPercentage = freeThrowPercentage / MAX_FREE_THROW_PERCENT;
  const normalizedSteals = stealsPerGame / (MAX_STEALS / player.games);
  const normalizedBlocks = blocksPerGame / (MAX_BLOCKS / player.games);
  const normalizedDefensiveRebounds = defensiveReboundsPerGame / (MAX_DEFENSIVE_REBOUNDS / player.games);
  const normalizedPersonalFouls = personalFoulsPerGame / (MAX_PERSONAL_FOULS / player.games);


  const offensiveRating = Math.round(
    ((normalizedPoints * 0.4) + (normalizedAssists * 0.3) +
    (normalizedOffensiveRebounds * 0.1) + (normalizedFieldGoalPercentage * 0.1) +
    (normalizedFreeThrowPercentage * 0.1)) * 100
  );


  const defensiveRating = Math.round(
    ((normalizedSteals * 0.4) + (normalizedBlocks * 0.3) +
    (normalizedDefensiveRebounds * 0.2) - (normalizedPersonalFouls * 0.1)) * 100
  );


  const overallRating = Math.round((offensiveRating + defensiveRating) / 2);

  return (
    <Card className="w-64 bg-slate-800 text-white overflow-hidden relative">

      <div className="absolute top-2 left-2 bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center z-10">
        {overallRating}
      </div>

      <div className="relative h-48">
        <img
          src={player.imageUrl}
          alt={player.playerName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-2">
          <h2 className="text-lg font-bold">{player.playerName}</h2>
          <p className="text-sm">{player.position}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-xs uppercase font-semibold">Offense</p>
            <p className="text-2xl font-bold text-yellow-400">{offensiveRating}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase font-semibold">Defense</p>
            <p className="text-2xl font-bold text-blue-400">{defensiveRating}</p>
          </div>
        </div>
        <div className="mt-4 text-xs">
          <p>Age: {player.age} | Games: {player.games}</p>
          <p>PPG: {pointsPerGame.toFixed(1)} | RPG: {(player.totalRb / player.games).toFixed(1)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NBAPlayerCard;
