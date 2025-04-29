
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player, PieceColor } from '../types/chess';
import { v4 as uuidv4 } from 'uuid';

interface LobbyViewProps {
  onGameStart: () => void;
}

const LobbyView: React.FC<LobbyViewProps> = ({ onGameStart }) => {
  const { createNewGame } = useGame();
  const [playerName, setPlayerName] = useState('Player');
  const [playerColor, setPlayerColor] = useState<PieceColor>('white');
  
  const handleStartGame = () => {
    const player: Player = {
      id: uuidv4(),
      name: playerName || 'Player',
      color: playerColor,
    };
    
    const computer: Player = {
      id: 'computer',
      name: 'Computer',
      color: playerColor === 'white' ? 'black' : 'white',
      isComputer: true,
    };
    
    if (playerColor === 'white') {
      createNewGame(player, computer);
    } else {
      createNewGame(computer, player);
    }
    
    onGameStart();
  };
  
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chess Verse</CardTitle>
          <CardDescription>
            Start a new chess game
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choose Your Side</Label>
            <div className="flex gap-2">
              <Button 
                onClick={() => setPlayerColor('white')}
                variant={playerColor === 'white' ? 'default' : 'outline'}
                className="flex-1"
              >
                White
              </Button>
              <Button 
                onClick={() => setPlayerColor('black')}
                variant={playerColor === 'black' ? 'default' : 'outline'}
                className="flex-1"
              >
                Black
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" onClick={handleStartGame}>
            Start Game
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Multiplayer Game</CardTitle>
          <CardDescription>
            Play with friends
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-code">Room Code</Label>
            <div className="flex gap-2">
              <Input id="room-code" placeholder="Enter room code" />
              <Button>Join</Button>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-sm text-gray-500">or</span>
          </div>
          
          <Button className="w-full" variant="outline">
            Create Room
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LobbyView;
