/**
 * Project Telll
 * @author Monsenhor
 * @version 0.003
 */


#ifndef _TELLL_H
#define _TELLL_H

class Telll {
public: 
    
    /**
     * @param data
     */
    void login( data);
    
    void start();
    
    /**
     * @param movieId
     */
    void getMovie( movieId);
    
    /**
     * @param plId
     */
    void getPhotolink( plId);
    
    /**
     * @param trkId
     */
    void getTrackms( trkId);
    
    /**
     * @param data
     */
    void listPhotolinks( data);
    
    /**
     * @param data
     */
    void listMovies( data);
    
    /**
     * @param data
     */
    void sendPhotolink( data);
};

#endif //_TELLL_H