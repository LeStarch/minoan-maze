#include <limits.h>
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

#include "maze.h"
/**
 * Minimum int function
 */
int min(int a, int b)
{
    return (a > b)?b:a;
}
/**
 * Maximum float
 */
float max(float a, float b)
{
    return (a >b)?a:b;
}

/**
 * Allocate this maze
 * int dim - dimension of this maze
 */
Maze* allocateMaze(int dimx,int dimy)
{
    int i;
    Maze* maze = (Maze*)malloc(sizeof(Maze));
    int** grid = (int**)malloc(sizeof(int*)*dimx);
    int*  temp = (int*)malloc(sizeof(int)*dimx*dimy);
    for (i = 0; i < dimx; i++)
    {
        grid[i] = temp+(i*dimy);
    }
    maze->dimx = dimx;
    maze->dimy = dimy;
    maze->grid = grid;
    maze->threshold = MAX;
    return maze;
}
/**
 * Clones the maze
 * Maze* maze - maze to clone
 */
Maze* cloneMaze(Maze* maze)
{
    int i,j;
    Maze* temp = allocateMaze(maze->dimx,maze->dimy);
    for (i = 0; i < temp->dimx; i++)
    {
        for (j = 0; j < temp->dimy; j++)
        {
            temp->grid[i][j] = maze->grid[i][j];
        } 
    }
    temp->threshold = maze->threshold;
    return temp;
}
/**
 * Free this maze
 */
void freeMaze(Maze* maze) {
    free(*maze->grid);
    free(maze->grid);
    free(maze);
}
/**
 * Print the maze as a numerical string
 * Maze* maze - maze struct
 */
void printNumericalMaze(Maze* maze) {
    //Calculate size of largest number
    //and sign of smallest
    int i,j,size,sign=0,max=INT_MIN;
    for (i = 0; i < maze->dimx; i++)
    {
        for (j = 0; j < maze->dimy; j++) 
        {
            if (maze->grid[i][j] > max)
                max = maze->grid[i][j];
            if (sign == 0 && maze->grid[i][j] < 0)
                sign = 1;
        }
    }
    size = ((max == 0)?1:(int)log10((float)abs(max))+1) + sign;
    //Print maze given size of largest numver
    for (i = 0; i < maze->dimx; i++)
    {
        for (j = 0; j < maze->dimy; j++)
        {
            printf("%*d",size+1,maze->grid[i][j]);
        }
        printf("\n");
    }
}

void printMaze(Maze* maze)
{
    int i,j;
    char disp = ' ';
    for (i = 0; i < maze->dimx; i++)
    {
        for (j = 0; j < maze->dimy; j++)
        {
            disp = (maze->grid[i][j] >= maze->threshold) ? '#' :' ';
            printf("%c%c",disp,disp);
        }
        printf("\n");
    }
}
/**
 * Can the maze be solved given the threshold?
 * Maze* maze - maze to prove solvablility
 */
int solvable(Maze* maze,int threshold)
{
    int i,j,ret = 0;
    Maze* temp = cloneMaze(maze);
    for (i = 1; i < temp->dimx - 1; i++)
    {
        for (j = 1; j < temp->dimy - 1; j++)
        {
            if (temp->grid[i][j] < threshold)
                temp->grid[i][j] = 0;
            else
                temp->grid[i][j] = MAX;
        }
    }
    //printNumericalMaze(temp);
    for (i = 1; i < temp->dimx; i++)
    {
        for (j = 1; j < temp->dimy; j++)
        {
            if (temp->grid[i][j] >= MAX)
                continue;
            temp->grid[i][j] = min(temp->grid[i-1][j],temp->grid[i][j-1]) + 1;
        }
    }
    ret = (temp->grid[temp->dimx-1][temp->dimy-2] < MAX) && (temp->grid[temp->dimx-1][temp->dimy-2] != 0); 
    freeMaze(temp);
    return ret;
}
/**
 * Calculate the highest threshold for which one can
 * navigate the maze using only numbers less than this 
 * threshold
 * Maze* maze - maze to get navigation threshold
 */
int calculateNavigationThreshold(Maze* maze)
{
    int threshold;
    for (threshold = MAX; threshold >= 0; threshold--)
    {
        if (!solvable(maze,threshold))
            return threshold + 1;
    }
    return -1;
}
/**
 * Generate a random maze with at least given density
 * Note: May never end
 * float density - wall density
 * int dimx - x dimension
 * int dimy - y dimension
 */
Maze* generate(float density, int dimx, int dimy)
{
    int i,j,cnt = 0;
    float closest=0.0f,effective=0.0f;
    Maze* maze = allocateMaze(dimx,dimy);
    effective = ((density > 0.5f)?0.5f:
                        ((density < 0.0f)?0.0f:density));
    fprintf(stderr,"Generating: %10d Closest: %10f\r",cnt,closest);
    while ( ((float)(MAX - maze->threshold)/(float)(MAX)) <= effective )
    {
        if (cnt % 200 == 0)
        {
            fprintf(stderr,"Generating: %10d Closest: %10f\r",cnt,closest);
            fflush(stderr);
        }
        cnt++;
        for (i = 0; i < maze->dimx; i++)
        {
            for (j = 0; j < maze->dimy; j++)
            {
                //Baised for MAX values not a power of 2
                maze->grid[i][j] = rand() % MAX;
                if (i == 0 || i == maze->dimx-1 || j == 0 || j == maze->dimy-1)
                    maze->grid[i][j] = MAX;
            }
        }
        maze->grid[0][1] = 0;
        maze->grid[maze->dimx-1][maze->dimy-2] = 0;
        //printNumericalMaze(maze);
        maze->threshold = calculateNavigationThreshold(maze);
        closest = max(closest,((float)(MAX - maze->threshold)/(float)(MAX)));
    }
    fprintf(stderr,"Generating: %10d Closest: %10f\r",cnt,closest);
    fprintf(stderr,"\n");
    return maze;
}


/**
 * Main function
 * int argc - number of arguments
 * char** argv - argument values
 */
int main(int argc, char** argv)
{
    Maze* maze;
    srand(time(NULL));
    maze = generate(0.35f,100,100);
    printMaze(maze);    
    freeMaze(maze);
}


