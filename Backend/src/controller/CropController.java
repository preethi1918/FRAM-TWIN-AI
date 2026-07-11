package com.farmtwin.controller;

import com.farmtwin.dto.Requests.CropRequest;
import com.farmtwin.service.MLClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/crop")
public class CropController {

    private final MLClientService mlClientService;

    @Autowired
    public CropController(MLClientService mlClientService) {
        this.mlClientService = mlClientService;
    }

    @PostMapping("/recommend")
    public Mono<Map> recommendCrop(@Valid @RequestBody CropRequest request) {
        return mlClientService.recommendCrop(request);
    }
}
